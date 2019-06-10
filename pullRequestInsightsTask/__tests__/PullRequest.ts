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

    function makeThread(commentsContents: string[], threadStatus?: azureGitInterfaces.CommentThreadStatus, threadId?: number): azureGitInterfaces.GitPullRequestCommentThread {
        let threadComments = [];
        for (let commentContent of commentsContents){
            threadComments.push({content: commentContent});
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

    function makeCommentContentOfCorrectForm(buildIteration: string): string{
        return messages.failureCommentHeading.format(buildIteration) + messages.failureCommentRow.format("fake", "fake", "fake", "fake", "fake", "fake", "fake", "fake");
    }

    beforeEach (() => {
        pullRequest = new PullRequest(2, "repo", "project");
        mockApi = mock(ReleaseAzureApi);
    })

    test("Does not find a comment thread when comments are of wrong format", () => {
        setThreads([makeThread(["|jk jk hj| failure |", "fake comment"]), makeThread(["|jk jk hj| failure |", "fake comment"])]);
        expect(pullRequest.getCurrentIterationCommentThread(mockApi, "thisBuild")).toBeNull; 
    });

    test("Finds comment thread when comment of same build iteration in correct format exists", async () => {
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeCommentContentOfCorrectForm("345")], 5);
        setThreads([makeThread(["|jk jk hj| failure |", "fake comment"]), expectedThread]);
        expect((await pullRequest.getCurrentIterationCommentThread(mockApi, "345"))).toBe(expectedThread); 
    });

    test("Finds correct comment thread when many comment threads of correct format exist", async () => {
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeCommentContentOfCorrectForm("400")], 7);
        setThreads([makeThread(["fake comment"]), makeThread([makeCommentContentOfCorrectForm("345")], 5), expectedThread]);
        expect((await pullRequest.getCurrentIterationCommentThread(mockApi, "400"))).toBe(expectedThread); 
    });

    test("Calls to create new thread when adding comment", () => {
        let commentContent:string = makeCommentContentOfCorrectForm("500");
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([commentContent]);
        let callback: sinon.SinonSpy = sinon.spy(mockApi, "postNewCommentThread");
        pullRequest.addNewComment(mockApi, commentContent);
        expect(callback.calledWith(expectedThread, 2, "repo", "project"));
    });

    test("Only calls to deactivate comments that do not match current build iteration", () => {
        let threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeCommentContentOfCorrectForm("90")], azureGitInterfaces.CommentThreadStatus.Active, 6), makeThread([makeCommentContentOfCorrectForm("800")], azureGitInterfaces.CommentThreadStatus.Active, 8)];
        let threadNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] =  [makeThread([makeCommentContentOfCorrectForm("750")], azureGitInterfaces.CommentThreadStatus.Active, 5)];
        let callback: sinon.SinonSpy = sinon.spy(mockApi, "updateCommentThread");
        sinon.stub(mockApi, "getCommentThreads").resolves(threadNotToDeactivate.concat(threadsToDeactivate));
        pullRequest.deactivateOldComments(mockApi, 5); 
        for (let thread of threadsToDeactivate) {
            expect(callback.calledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", thread.id));
        }
        expect(callback.neverCalledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", threadNotToDeactivate[0].id));
    });

    test("Only calls to deactivate comments that are active or undefined", () =>{
        let threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeCommentContentOfCorrectForm("90")], azureGitInterfaces.CommentThreadStatus.Active, 6), makeThread([makeCommentContentOfCorrectForm("800")], undefined, 8)];
        let threadsNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] =  [makeThread([makeCommentContentOfCorrectForm("750")], azureGitInterfaces.CommentThreadStatus.Active, 10), makeThread([makeCommentContentOfCorrectForm("750")], azureGitInterfaces.CommentThreadStatus.WontFix, 9)];
        let callback: sinon.SinonSpy = sinon.spy(mockApi, "updateCommentThread");
        sinon.stub(mockApi, "getCommentThreads").resolves(threadsNotToDeactivate.concat(threadsToDeactivate));
        pullRequest.deactivateOldComments(mockApi, 5); 
        for (let thread of threadsToDeactivate) {
            expect(callback.calledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", thread.id));
        }
        for (let thread of threadsNotToDeactivate) {
            expect(callback.neverCalledWith({status: azureGitInterfaces.CommentThreadStatus.Closed}, 2, "repo", "project", thread.id));
        }
    });

    test("Calls to edit matching comment in matching thread", () =>{
        expect(5).toEqual(6)
    });

    test("Only edits one comment in matching comment thread", () =>{
        expect(5).toEqual(6)
    });

    test("Content for updated comment includes correct information", () =>{
        expect(5).toEqual(6)
    });

    test("Comment not from service is not edited", () =>{
        expect(5).toEqual(6)
    });




});