import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { PullRequest } from "../PullRequest";
import { AbstractAzureApi } from "../AbstractAzureApi";
import mockito, { mock } from "ts-mockito";
import { ReleaseAzureApi } from "../ReleaseAzureApi";
import sinon, { assert } from "sinon";
import messages from '../user_messages.json';
import '../StringExtensions';


describe("PullRequest Tests", () => {

    let pullRequest: PullRequest;
    let threads: azureGitInterfaces.GitPullRequestCommentThread[];
    let mockApi: AbstractAzureApi;

    function makeThread(commentsContents: string[], includeCommentIds: boolean, threadStatus?: azureGitInterfaces.CommentThreadStatus, threadId?: number): azureGitInterfaces.GitPullRequestCommentThread {
        let threadComments = [];
        for (let i = 0; i < commentsContents.length; i++){
            let comment: azureGitInterfaces.Comment = {content: commentsContents[i]};
            if (includeCommentIds){
                comment.id = i;
            }
            threadComments.push(comment);
        }
        return {
            comments: threadComments,
            status: threadStatus, 
            id: threadId
        }
    }

    function setThreads(threadsToGet: azureGitInterfaces.GitPullRequestCommentThread[]): void {
        threads = threadsToGet;
        sinon.stub(mockApi, "getCommentThreads").resolves(threads);
    }

    function makeCommentContentOfCorrectForm(buildIteration: string, pipelineName?: string): string {
        if (!pipelineName){
            pipelineName = "fake";
        }
        return messages.newIterationCommentHeading.format(buildIteration) + messages.failureCommentRow.format(pipelineName, "fake", "fake", "fake", "fake", "fake", "fake", "fake");
    }

    function makeCommentContentRow(pipelineName: string){
        return messages.failureCommentRow.format(pipelineName, "fake", "fake", "fake", "fake", "fake", "fake", "fake");
    }

    beforeEach (() => {
        pullRequest = new PullRequest(2, "repo", "project");
        mockApi = mock(ReleaseAzureApi);
    })

    test("Does not find a comment thread when comments are of wrong format", async () => {
        setThreads([makeThread(["|jk jk hj| failure |", "fake comment"], false), makeThread(["|jk jk hj| failure |", "fake comment"], false)]);
        expect(pullRequest.getCurrentIterationCommentThread(mockApi, await pullRequest.getCurrentServiceComments(mockApi), "thisBuild")).toBeNull; 
    });

    test("Finds comment thread when comment of same build iteration in correct format exists", async () => {
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeCommentContentOfCorrectForm("345")], true , 5);
        console.log("comment: " + expectedThread.comments[0].content)
        setThreads([makeThread(["|jk jk hj| failure |", "fake comment"], true), expectedThread]);
        expect((await pullRequest.getCurrentIterationCommentThread(mockApi,  await pullRequest.getCurrentServiceComments(mockApi), "345"))).toBe(expectedThread); 
    });

    test("Finds correct comment thread when many comment threads of correct format exist", async () => {
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeCommentContentOfCorrectForm("400")], false, 7);
        setThreads([makeThread(["fake comment"], false), makeThread([makeCommentContentOfCorrectForm("345")], false, 5), expectedThread]);
        expect((await pullRequest.getCurrentIterationCommentThread(mockApi,  await pullRequest.getCurrentServiceComments(mockApi), "400"))).toBe(expectedThread); 
    });

    test("Calls to create new thread when adding comment", () => {
        let commentContent:string = makeCommentContentOfCorrectForm("500");
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([commentContent], false);
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "postNewCommentThread");
        pullRequest.addNewComment(mockApi, commentContent);
        expect(callback).toBeCalledWith({comments: expectedThread.comments}, 2, "repo", "project");
    });

    test("Only calls to deactivate comments that do not match current build iteration", async () => {
        let threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeCommentContentOfCorrectForm("90")], false, azureGitInterfaces.CommentThreadStatus.Active, 16), makeThread([makeCommentContentOfCorrectForm("800")], false, azureGitInterfaces.CommentThreadStatus.Active, 18)];
        let threadNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] =  [makeThread([makeCommentContentOfCorrectForm("750")], false, azureGitInterfaces.CommentThreadStatus.Active, 5)];
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateCommentThread");
        setThreads(threadNotToDeactivate.concat(threadsToDeactivate));
        console.log("number threads: " + (await mockApi.getCommentThreads(2, "repo", "project")).length);
        await pullRequest.deactivateOldComments(mockApi,  await pullRequest.getCurrentServiceComments(mockApi), 5); 
        for (let thread of threadsToDeactivate) {
           expect(callback).toBeCalledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", thread.id);
        }
       expect(callback).not.toBeCalledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", threadNotToDeactivate[0].id);
    });

    test("Only calls to deactivate comments that are active or undefined", async () =>{
        let threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeCommentContentOfCorrectForm("90")], false, azureGitInterfaces.CommentThreadStatus.Active, 600), makeThread([makeCommentContentOfCorrectForm("800")], false, undefined, 800)];
        let threadsNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] =  [makeThread([makeCommentContentOfCorrectForm("750")], false, azureGitInterfaces.CommentThreadStatus.Closed, 1000), makeThread([makeCommentContentOfCorrectForm("750")], false, azureGitInterfaces.CommentThreadStatus.WontFix, 900)];
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateCommentThread");
        setThreads(threadsNotToDeactivate.concat(threadsToDeactivate));
        await pullRequest.deactivateOldComments(mockApi,  await pullRequest.getCurrentServiceComments(mockApi), 5); 
        for (let thread of threadsToDeactivate) {
           expect(callback).toBeCalledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", thread.id);
        }
        for (let thread of threadsNotToDeactivate) {
           expect(callback).not.toBeCalledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", thread.id);
        }
    });

    test("Calls to edit only matching comment in matching thread", async () =>{
        let commentContentToAddTo: string = makeCommentContentOfCorrectForm("500");
        let commentContentToAdd: string = makeCommentContentRow("release-77");
        let commentContentNotToAddTo: string = makeCommentContentOfCorrectForm("800");
        let threadToEdit: azureGitInterfaces.GitPullRequestCommentThread = makeThread([commentContentNotToAddTo, commentContentToAddTo], true, azureGitInterfaces.CommentThreadStatus.Active, 10);
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateComment");
        await pullRequest.editMatchingCommentInThread(mockApi, threadToEdit, commentContentToAdd, "500");
        expect(callback).toBeCalledWith({content: commentContentToAddTo + commentContentToAdd}, 2, "repo", "project", 10, 1);
        expect(callback).not.toBeCalledWith({content: commentContentNotToAddTo + commentContentToAdd}, 2, "repo", "project", 10, 0);
    });

    test("Only edits one comment in matching comment thread", async () =>{
        let threadToEdit: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeCommentContentOfCorrectForm("build98"), makeCommentContentOfCorrectForm("build99"), makeCommentContentOfCorrectForm("build100")], true);
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateComment");
        await pullRequest.editMatchingCommentInThread(mockApi, threadToEdit, makeCommentContentRow("release897"), "build98");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("Does not edit thread if no comment matches", () =>{
        let threadToEdit: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeCommentContentOfCorrectForm("build98"), makeCommentContentOfCorrectForm("build99"), makeCommentContentOfCorrectForm("build100")], true);
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateComment");
        pullRequest.editMatchingCommentInThread(mockApi, threadToEdit, makeCommentContentRow("release897"), "build97");
        expect(callback).toHaveBeenCalledTimes(0);
    });
    
});