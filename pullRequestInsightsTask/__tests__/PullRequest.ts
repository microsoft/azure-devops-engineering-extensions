import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { PullRequest } from "../PullRequest";
import { AbstractAzureApi } from "../AbstractAzureApi";
import mockito, { mock } from "ts-mockito";
import { ReleaseAzureApi } from "../ReleaseAzureApi";
import sinon, { assert } from "sinon";
import '../StringExtensions';
import tl = require('azure-pipelines-task-lib/task');
import commentProperties from "../service_comment_properties.json";



describe("PullRequest Tests", () => {

    let pullRequest: PullRequest;
    let threads: azureGitInterfaces.GitPullRequestCommentThread[];
    let mockApi: AbstractAzureApi;
    const desiredAuthor: string = "Project Collection Build Service (vscsepsteam)";
    const desiredTask: string = "PullRequestInsights"
    const active: azureGitInterfaces.CommentThreadStatus = azureGitInterfaces.CommentThreadStatus.Active;


    function makeThread(comments: azureGitInterfaces.Comment[], threadProperties?: any, id?: number, status?: azureGitInterfaces.CommentThreadStatus): azureGitInterfaces.GitPullRequestCommentThread {
        let thread: azureGitInterfaces.GitPullRequestCommentThread = {
            comments: comments,
            properties: threadProperties
        }
        if (id) {
            thread.id = id;
        }
        if (status) {
            thread.status = status;
        }
        return thread;
    }

    function makeComment(content?: string, author?: string, id?: number) {
        let comment: azureGitInterfaces.Comment = { content: content };
        if (author) {
            comment.author = { displayName: author };
        }
        if (id) {
            comment.id = id;
        }
        return comment;
    }

    function makeRetrievedProperties(iteration: string) {
        return {
            [commentProperties.taskPropertyName]: { $value: "PullRequestInsights" },
            [commentProperties.iterationPropertyName]: { $value: iteration }
        }
    }

    function makeSentProperties(iteration: string) {
        return {
            [commentProperties.taskPropertyName]: "PullRequestInsights",
            [commentProperties.iterationPropertyName]: iteration
        }
    }


    function setThreads(threadsToGet: azureGitInterfaces.GitPullRequestCommentThread[]): void {
        threads = threadsToGet;
        sinon.stub(mockApi, "getCommentThreads").resolves(threads);
    }

    beforeEach(() => {
        pullRequest = new PullRequest(2, "repo", "project");
        mockApi = mock(ReleaseAzureApi);
    });

    test("Calls to create new thread when adding comment", () => {
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "postNewCommentThread");
        pullRequest.addNewComment(mockApi, "", "500");
        expect(callback).toBeCalled();
    });

    test("Calls to create thread with correct properties when adding comment", async () => {
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "postNewCommentThread");
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeComment("")], makeSentProperties("500"));
        pullRequest.addNewComment(mockApi, "", "500");
        expect(callback).toBeCalledWith(expectedThread, 2, "repo", "project");

    });

    test("Only calls to deactivate comments that do not match current build iteration", async () => {
        let threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("900"), 0), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("800"), 1)];
        let threadNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("500"), 2)];
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateCommentThread");
        setThreads(threadNotToDeactivate.concat(threadsToDeactivate));
        await pullRequest.deactivateOldComments(mockApi, await pullRequest.getCurrentServiceCommentThreads(mockApi), 2);
        for (let thread of threadsToDeactivate) {
            expect(callback).toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id);
        }
        expect(callback).not.toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", threadNotToDeactivate[0].id);
    });

    test("Only calls to deactivate comments that are active or undefined", async () => {
        let threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("900"), 0, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("800"), 1, undefined)];
        let threadsNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("500"), 2, azureGitInterfaces.CommentThreadStatus.Closed), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("500"), 2, azureGitInterfaces.CommentThreadStatus.ByDesign)];
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateCommentThread");
        setThreads(threadsNotToDeactivate.concat(threadsToDeactivate));
        await pullRequest.deactivateOldComments(mockApi, await pullRequest.getCurrentServiceCommentThreads(mockApi), 2);
        for (let thread of threadsToDeactivate) {
            expect(callback).toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id);
        }
        for (let thread of threadsNotToDeactivate) {
            expect(callback).not.toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id);
        }
    });

    test("Calls to edit only correct comment in correct thread", async () => {
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateComment");
        let thread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeComment("hello", "", 2), makeComment("hi", "", 1)], undefined, 5);
        pullRequest.editCommentInThread(mockApi, thread, 2, "goodbye");
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith({ content: "hellogoodbye" }, 2, "repo", "project", 5, 2);
    });

    test("Does not edit any other comments in thread if thread is empty", async () => {
        let callback: jest.SpyInstance = jest.spyOn(mockApi, "updateComment");
        let thread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([], undefined, 5);
        pullRequest.editCommentInThread(mockApi, thread, 1, "goodbye");
        expect(callback).toHaveBeenCalledTimes(0);
    });


    test("Correct comment thread is found for iteration", () => {
        let expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("11"), 12, active);
        let threads: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("1"), 2, active), expectedThread, makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)];
        expect(pullRequest.getCurrentIterationCommentThread(threads, "11")).toBe(expectedThread);
    });

    test("No comment thread is found when build iteration is not present", () => {
        let threads: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("1"), 2, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)];
        expect(pullRequest.getCurrentIterationCommentThread(threads, "11")).toBeNull();
    });

    test("No comment thread is found when comment thread is missing properties", () => {
        let threads: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], 2, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)];
        expect(pullRequest.getCurrentIterationCommentThread(threads, "1")).toBeNull();
    });

    test("No comment thread is found when comment thread has iteration but is missing other properties data", () => {
        let threads: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", desiredAuthor)], {
            iterationPropertyName
                : "1"
        }, 2, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)];
        expect(pullRequest.getCurrentIterationCommentThread(threads, "1")).toBeNull();
    });

    test("No comment thread is found when comment thread does not have comments", () => {
        let threads: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([], makeRetrievedProperties("1"), 2, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)];
        expect(pullRequest.getCurrentIterationCommentThread(threads, "1")).toBeNull();
    });

    test("No comment thread is found when comment thread first comment is not authored by service", () => {
        let threads: azureGitInterfaces.GitPullRequestCommentThread[] = [makeThread([makeComment("", "me")], makeRetrievedProperties("1"), 2, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)];
        expect(pullRequest.getCurrentIterationCommentThread(threads, "1")).toBeNull();
    });

    test("All comment threads are found as service comments when all match criteria", async () => {
        setThreads([makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 2, active), makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 112, active)]);
        expect(await pullRequest.getCurrentServiceCommentThreads(mockApi)).toEqual(threads);
    });

    test("Some comment threads are found as service comments when only some match service criteria", async () => {
        setThreads([makeThread([makeComment("", desiredAuthor)], makeRetrievedProperties("111"), 2, active), makeThread([makeComment("", desiredAuthor)], undefined, 112, active), makeThread([makeComment("", "someoneElse")], makeRetrievedProperties("111"), 112, active)]);
        expect(await pullRequest.getCurrentServiceCommentThreads(mockApi)).toEqual([threads[0]]);
    });

    test("Null is returned when no comment threads are from service", async () => {
        setThreads([makeThread([makeComment("", desiredAuthor)], { fromTask: desiredTask }, 2, active), makeThread([makeComment("", desiredAuthor)], undefined, 112, active), makeThread([makeComment("", "someoneElse")], makeRetrievedProperties("111"), 112, active)]);
        expect(await pullRequest.getCurrentServiceCommentThreads(mockApi)).toEqual([]);
    });

});