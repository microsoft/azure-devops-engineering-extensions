import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractAzureApi } from "../dataProviders/AbstractAzureApi.js";
import tl = require("azure-pipelines-task-lib/task");
import commentProperties from "../resources/service_comment_properties.json";
import { ServiceComment } from "../models/ServiceComment.js";

export class PullRequest {
  private id: number;
  private repository: string;
  private projectName: string;
  private pullRequestData: azureGitInterfaces.GitPullRequest;
  private mostRecentSourceCommitId: string;
  private lastMergeTargetCommitId: string;

  constructor(
    id: number,
    repository: string,
    projectName: string,
    pullRequestData: azureGitInterfaces.GitPullRequest
  ) {
    this.id = id;
    this.repository = repository;
    this.projectName = projectName;
    this.pullRequestData = pullRequestData;
    this.mostRecentSourceCommitId = null;
    this.lastMergeTargetCommitId = null;
    this.parseDataForCommitIds();
  }

  /**
   * Gets name of branch to which pull request is merging
   */
  public getTargetBranchName(): string {
    return this.pullRequestData.targetRefName;
  }

  /**
   * Gets id of most recent source commit made
   */
  public getMostRecentSourceCommitId(): string {
    return this.mostRecentSourceCommitId;
  }

  public getLastMergeTargetCommitId(): string {
    return this.lastMergeTargetCommitId;
  }

  /**
   * Post new comment thread on pull request page
   * @param apiCaller Object to make API calls to AzureDevOps service
   * @param commentContent Content of comment to post in new thread
   * @param postStatus Status of thread to post
   */
  public async postNewThread(
    apiCaller: AbstractAzureApi,
    commentContent: string,
    postStatus: azureGitInterfaces.CommentThreadStatus
  ): Promise<azureGitInterfaces.GitPullRequestCommentThread> {
    const thread: azureGitInterfaces.CommentThread = {
      comments: [{ content: commentContent }],
      status: postStatus
    };
    thread.properties = {
      [commentProperties.taskPropertyName]: commentProperties.taskPropertyValue,
      [commentProperties.iterationPropertyName]: this.mostRecentSourceCommitId
    };
    return apiCaller.postNewCommentThread(
      thread,
      this.id,
      this.repository,
      this.projectName
    );
  }

  /**
   * Edits comments made by Pull Request Insights task
   * @param apiCaller Object to make API calls to AzureDevOps service
   * @param serviceComment Updated Pull Request Insights comment
   */
  public async editServiceComment(
    apiCaller: AbstractAzureApi,
    serviceComment: ServiceComment
  ): Promise<void> {
    await apiCaller.updateComment(
      { content: serviceComment.getContent() },
      this.id,
      this.repository,
      this.projectName,
      serviceComment.getParentThreadId(),
      serviceComment.getId()
    );
  }

  /**
   * Changes status of Pull Request Insights task comment threads to Closed, with exception of current iteration comment thread
   * @param apiCaller Object to make API calls to AzureDevOps service
   * @param serviceComments Comments to close
   * @param currentIterationCommentId Id of current thread that should not be closed
   */
  public async deactivateOldComments(
    apiCaller: AbstractAzureApi,
    serviceComments: azureGitInterfaces.GitPullRequestCommentThread[],
    currentIterationCommentId: number
  ): Promise<void> {
    for (const commentThread of serviceComments) {
      if (
        commentThread.id !== currentIterationCommentId &&
        (commentThread.status ===
          azureGitInterfaces.CommentThreadStatus.Active ||
          commentThread.status === undefined)
      ) {
        tl.debug("comment thread id to be deactivated: " + commentThread.id);
        apiCaller.updateCommentThread(
          { status: azureGitInterfaces.CommentThreadStatus.Closed },
          this.id,
          this.repository,
          this.projectName,
          commentThread.id
        );
      }
    }
  }

  /**
   * Deletes Pull Request Insights task comment threads, with exception of current iteration comment thread
   * @param apiCaller Object to make API calls to AzureDevOps service
   * @param serviceComments Comments to delete
   * @param currentIterationCommentId Id of current thread that should not be closed
   */
  public async deleteOldComments(
    apiCaller: AbstractAzureApi,
    serviceComments: azureGitInterfaces.GitPullRequestCommentThread[],
    currentIterationCommentId: number
  ): Promise<void> {
    for (const commentThread of serviceComments) {
      if (
        commentThread.id !== currentIterationCommentId &&
        commentThread.comments.length === 1
      ) {
        apiCaller.deleteComment(
          this.id,
          this.repository,
          this.projectName,
          commentThread.id,
          commentThread.comments[0].id
        );
      }
    }
  }

  /**
   * Checks to see if this pull request has a comment thread from Pull Request Insights task for the most recent source commit
   * @param threads Threads on this pull request
   */
  public hasServiceThreadForExistingIteration(
    threads: azureGitInterfaces.GitPullRequestCommentThread[]
  ): boolean {
    return this.getCurrentIterationCommentThread(threads) !== null;
  }

  /**
   * Creates a ServiceComment object to represent the current iteration by finding current data on this pull request
   * page or creating a new ServiceComment object
   * @param threads Threads on this pull request to search for existing comment data
   */
  public makeCurrentIterationComment(
    threads: azureGitInterfaces.GitPullRequestCommentThread[]
  ): ServiceComment {
    const currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = this.getCurrentIterationCommentThread(
      threads
    );
    if (
      currentIterationCommentThread &&
      currentIterationCommentThread.comments &&
      currentIterationCommentThread.comments[0]
    ) {
      return new ServiceComment(
        currentIterationCommentThread.comments[0],
        currentIterationCommentThread.id
      );
    }
    return new ServiceComment();
  }

  public async getCurrentServiceCommentThreads(
    apiCaller: AbstractAzureApi
  ): Promise<azureGitInterfaces.GitPullRequestCommentThread[]> {
    const commentThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await apiCaller.getCommentThreads(
      this.id,
      this.repository,
      this.projectName
    );
    const serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = [];
    for (const commentThread of commentThreads) {
      if (this.threadIsFromService(commentThread)) {
        serviceThreads.push(commentThread);
        tl.debug(
          "the thread: thread id = " + commentThread.id + " is from service"
        );
      }
    }
    return serviceThreads;
  }

  private getCurrentIterationCommentThread(
    threads: azureGitInterfaces.GitPullRequestCommentThread[]
  ): azureGitInterfaces.GitPullRequestCommentThread | null {
    for (const commentThread of threads) {
      if (
        this.threadIsFromService(commentThread) &&
        this.getIterationFromServiceCommentThread(commentThread) ===
          this.mostRecentSourceCommitId
      ) {
        tl.debug(
          "comment thread id of thread of current source commit " +
            this.mostRecentSourceCommitId +
            ": thread id = " +
            commentThread.id
        );
        return commentThread;
      }
    }
    tl.debug(
      "no comment was found for iteration " + this.mostRecentSourceCommitId
    );
    return null;
  }

  private parseDataForCommitIds(): void {
    if (this.pullRequestData.lastMergeCommit) {
      this.mostRecentSourceCommitId = this.getIdFromCommit(
        this.pullRequestData.lastMergeCommit
      );
    }
    if (this.pullRequestData.lastMergeTargetCommit) {
      this.lastMergeTargetCommitId = this.getIdFromCommit(
        this.pullRequestData.lastMergeTargetCommit
      );
    }
  }

  private getIdFromCommit(commit: { commitId?: string }) {
    if (commit.commitId) {
      return commit.commitId;
    }
    return null;
  }

  private getIterationFromServiceCommentThread(
    thread: azureGitInterfaces.GitPullRequestCommentThread
  ): string {
    if (this.threadHasServiceProperties(thread)) {
      return thread.properties[commentProperties.iterationPropertyName].$value;
    }
    return null;
  }

  private threadIsFromService(
    thread: azureGitInterfaces.GitPullRequestCommentThread
  ): boolean {
    return (
      this.threadHasServiceProperties(thread) && this.threadHasComments(thread)
    );
  }

  private threadHasServiceProperties(
    thread: azureGitInterfaces.GitPullRequestCommentThread
  ): boolean {
    return (
      thread.properties &&
      thread.properties[commentProperties.taskPropertyName] &&
      thread.properties[commentProperties.taskPropertyName].$value ===
        commentProperties.taskPropertyValue &&
      thread.properties[commentProperties.iterationPropertyName]
    );
  }

  private threadHasComments(
    thread: azureGitInterfaces.GitPullRequestCommentThread
  ): boolean {
    return thread.comments.length > 0;
  }
}
