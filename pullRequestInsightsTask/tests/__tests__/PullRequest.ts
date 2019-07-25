import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractAzureApi } from "../../dataProviders/AbstractAzureApi";
import { mock } from "ts-mockito";
import sinon from "sinon";
import "../../utils/StringExtensions";
import tl = require("azure-pipelines-task-lib/task");
import commentProperties from "../../resources/service_comment_properties.json";
import { PullRequest } from "../../dataModels/PullRequest";
import { ReleaseAzureApi } from "../../dataProviders/ReleaseAzureApi";

describe("PullRequest Tests", () => {
  let pullRequest: PullRequest;
  let threads: azureGitInterfaces.GitPullRequestCommentThread[];
  let mockApi: AbstractAzureApi;
  const desiredAuthor: string =
    "Project Collection Build Service (vscsepsteam)";
  const desiredTask: string = "PullRequestInsights";
  const active: azureGitInterfaces.CommentThreadStatus =
    azureGitInterfaces.CommentThreadStatus.Active;
  const closed: azureGitInterfaces.CommentThreadStatus =
    azureGitInterfaces.CommentThreadStatus.Closed;

  function makeThread(
    comments: azureGitInterfaces.Comment[],
    threadProperties?: any,
    id?: number,
    status?: azureGitInterfaces.CommentThreadStatus
  ): azureGitInterfaces.GitPullRequestCommentThread {
    const thread: azureGitInterfaces.GitPullRequestCommentThread = {
      comments: comments,
      properties: threadProperties
    };
    if (id) {
      thread.id = id;
    }
    if (status) {
      thread.status = status;
    }
    return thread;
  }

  function makeComment(
    content?: string,
    author?: string,
    id?: number
  ): azureGitInterfaces.Comment {
    const comment: azureGitInterfaces.Comment = { content: content };
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
    };
  }

  function makeSentProperties(iteration: string) {
    return {
      [commentProperties.taskPropertyName]: "PullRequestInsights",
      [commentProperties.iterationPropertyName]: iteration
    };
  }

  function setThreads(
    threadsToGet: azureGitInterfaces.GitPullRequestCommentThread[]
  ): void {
    threads = threadsToGet;
    sinon.stub(mockApi, "getCommentThreads").resolves(threads);
  }

  beforeEach(() => {
    pullRequest = new PullRequest(2, "repo", "project", {
      lastMergeCommit: { commitId: "11" }
    });
    mockApi = mock(ReleaseAzureApi);
  });

  test("Most recent source commit id correctly determined", () => {
    expect(pullRequest.getMostRecentSourceCommitId()).toBe("11");
  });

  test("Null is returned when there is no recent source commit id", () => {
    pullRequest = new PullRequest(4, "repo", "proj", {});
    expect(pullRequest.getMostRecentSourceCommitId()).toBeNull();
  });

  test("Calls to create new thread when adding comment", () => {
    const callback: jest.SpyInstance = jest.spyOn(
      mockApi,
      "postNewCommentThread"
    );
    pullRequest.postNewThread(mockApi, "", closed);
    expect(callback).toBeCalled();
  });

  test("Calls to create thread with correct properties when adding comment", async () => {
    const callback: jest.SpyInstance = jest.spyOn(
      mockApi,
      "postNewCommentThread"
    );
    const expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread(
      [makeComment("")],
      makeSentProperties("11"),
      undefined,
      closed
    );
    pullRequest.postNewThread(mockApi, "", closed);
    expect(callback).toBeCalledWith(expectedThread, 2, "repo", "project");
  });

  test("Only calls to deactivate comments that do not match current build iteration", async () => {
    const threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("900"),
        0
      ),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("800"),
        1
      )
    ];
    const threadNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("500"),
        2
      )
    ];
    const callback: jest.SpyInstance = jest.spyOn(mockApi, "updateCommentThread");
    setThreads(threadNotToDeactivate.concat(threadsToDeactivate));
    await pullRequest.deactivateOldComments(
      mockApi,
      await pullRequest.getCurrentServiceCommentThreads(mockApi),
      2
    );
    for (const thread of threadsToDeactivate) {
      expect(callback).toBeCalledWith(
        { status: closed },
        2,
        "repo",
        "project",
        thread.id
      );
    }
    expect(callback).not.toBeCalledWith(
      { status: closed },
      2,
      "repo",
      "project",
      threadNotToDeactivate[0].id
    );
  });

  test("Only calls to deactivate comments that are active or undefined", async () => {
    const threadsToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("900"),
        0,
        active
      ),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("800"),
        1,
        undefined
      )
    ];
    const threadsNotToDeactivate: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("500"),
        2,
        closed
      ),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("500"),
        2,
        azureGitInterfaces.CommentThreadStatus.ByDesign
      )
    ];
    const callback: jest.SpyInstance = jest.spyOn(mockApi, "updateCommentThread");
    setThreads(threadsNotToDeactivate.concat(threadsToDeactivate));
    await pullRequest.deactivateOldComments(
      mockApi,
      await pullRequest.getCurrentServiceCommentThreads(mockApi),
      2
    );
    for (const thread of threadsToDeactivate) {
      expect(callback).toBeCalledWith(
        { status: closed },
        2,
        "repo",
        "project",
        thread.id
      );
    }
    for (const thread of threadsNotToDeactivate) {
      expect(callback).not.toBeCalledWith(
        { status: closed },
        2,
        "repo",
        "project",
        thread.id
      );
    }
  });

  test("Comment thread is found for iteration", () => {
    const expectedThread: azureGitInterfaces.GitPullRequestCommentThread = makeThread(
      [makeComment("", desiredAuthor)],
      makeRetrievedProperties("11"),
      12,
      closed
    );
    const threads: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("1"),
        2,
        active
      ),
      expectedThread,
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("111"),
        112,
        active
      )
    ];
    expect(pullRequest.hasServiceThreadForExistingIteration(threads)).toBe(
      true
    );
  });

  test("No comment thread is found when build iteration is not present", () => {
    const threads: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("1"),
        2,
        active
      ),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("111"),
        112,
        active
      )
    ];
    expect(pullRequest.hasServiceThreadForExistingIteration(threads)).toBe(
      false
    );
  });

  test("No comment thread is found when comment thread is missing properties", () => {
    const threads: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread([makeComment("", desiredAuthor)], 2, active),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("111"),
        112,
        active
      )
    ];
    expect(pullRequest.hasServiceThreadForExistingIteration(threads)).toBe(
      false
    );
  });

  test("No comment thread is found when comment thread has iteration but is missing other properties data", () => {
    const threads: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread(
        [makeComment("", desiredAuthor)],
        { iterationPropertyName: "11" },
        2,
        active
      ),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("151"),
        112,
        active
      )
    ];
    expect(pullRequest.hasServiceThreadForExistingIteration(threads)).toBe(
      false
    );
  });

  test("No comment thread is found when comment thread does not have comments", () => {
    const threads: azureGitInterfaces.GitPullRequestCommentThread[] = [
      makeThread([], makeRetrievedProperties("11"), 2, active),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("111"),
        112,
        active
      )
    ];
    expect(pullRequest.hasServiceThreadForExistingIteration(threads)).toBe(
      false
    );
  });

  test("All comment threads are found as service comments when all match criteria", async () => {
    setThreads([
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("11"),
        2,
        active
      ),
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("11"),
        112,
        active
      )
    ]);
    expect(await pullRequest.getCurrentServiceCommentThreads(mockApi)).toEqual(
      threads
    );
  });

  test("Some comment threads are found as service comments when only some match service criteria", async () => {
    setThreads([
      makeThread(
        [makeComment("", desiredAuthor)],
        makeRetrievedProperties("111"),
        2,
        active
      ),
      makeThread([makeComment("", desiredAuthor)], undefined, 112, active)
    ]);
    expect(await pullRequest.getCurrentServiceCommentThreads(mockApi)).toEqual([
      threads[0]
    ]);
  });

  test("Null is returned when no comment threads are from service", async () => {
    setThreads([
      makeThread(
        [makeComment("", desiredAuthor)],
        { fromTask: desiredTask },
        2,
        active
      ),
      makeThread([makeComment("", desiredAuthor)], undefined, 112, active)
    ]);
    expect(await pullRequest.getCurrentServiceCommentThreads(mockApi)).toEqual(
      []
    );
  });
});
