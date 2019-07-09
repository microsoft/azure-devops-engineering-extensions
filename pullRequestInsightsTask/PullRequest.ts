import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import messages from "./user_messages.json";
import { AbstractAzureApi } from "./AbstractAzureApi.js";
import tl = require('azure-pipelines-task-lib/task');
import commentProperties from "./service_comment_properties.json";


export class PullRequest {

    private id: number;
    private repository: string;
    private projectName: string;
    private pullRequestData: azureGitInterfaces.GitPullRequest;
    private mostRecentSourceCommitId: string;

    constructor(id: number, repository: string, projectName: string, pullRequestData: azureGitInterfaces.GitPullRequest) {
        this.id = id;
        this.repository = repository;
        this.projectName = projectName;    
        this.pullRequestData = pullRequestData;
        this.parseDataForMostRecentSourceCommitId();
    }

    public getTargetBranchName(): string {
        return this.pullRequestData.targetRefName;
    }

    public getMostRecentSourceCommitId(): string {
        return this.mostRecentSourceCommitId;
    }

    public mostRecentSourceCommitMatchesCurrent(givenSourceCommit: string) {
        return this.mostRecentSourceCommitId === givenSourceCommit;
    }

    public async addNewComment(apiCaller: AbstractAzureApi, commentContent: string, postStatus: azureGitInterfaces.CommentThreadStatus): Promise<azureGitInterfaces.GitPullRequestCommentThread> {
        let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: commentContent}), status: postStatus};
        thread.properties = {[commentProperties.taskPropertyName]: commentProperties.taskPropertyValue, [commentProperties.iterationPropertyName]: this.mostRecentSourceCommitId};
        tl.debug(messages.commentCompletedMessage);
        return apiCaller.postNewCommentThread(thread, this.id, this.repository, this.projectName);
    }

    public async deactivateOldComments(apiCaller: AbstractAzureApi, serviceComments: azureGitInterfaces.GitPullRequestCommentThread[], currentIterationCommentId: number): Promise<void> {
        for (let commentThread of serviceComments) {
            if (commentThread.id !== currentIterationCommentId && (commentThread.status === azureGitInterfaces.CommentThreadStatus.Active || commentThread.status === undefined)) {
                tl.debug("comment thread id to be deactivated: " + commentThread.id);
                apiCaller.updateCommentThread({ status: azureGitInterfaces.CommentThreadStatus.Closed }, this.id, this.repository, this.projectName, commentThread.id);
            }
        }
    }

    public async deleteOldComments(apiCaller: AbstractAzureApi, serviceComments: azureGitInterfaces.GitPullRequestCommentThread[], currentIterationCommentId: number): Promise<void> {
        for (let commentThread of serviceComments) {
            if (commentThread.id !== currentIterationCommentId && commentThread.comments.length === 1) {
                apiCaller.deleteComment(this.id, this.repository, this.projectName, commentThread.id, commentThread.comments[0].id);
            }
        }
    }

    public editCommentInThread(apiCaller: AbstractAzureApi, thread: azureGitInterfaces.GitPullRequestCommentThread, commentId: number, newContent: string): void {
        for (let comment of thread.comments) {
            if (comment.id === commentId) {
                let updatedContent: string = newContent;
                tl.debug("comment to be updated: thread id = " + thread.id + ", comment id = " + comment.id);
                tl.debug("updated content: " + updatedContent);
                apiCaller.updateComment({ content: updatedContent }, this.id, this.repository, this.projectName, thread.id, comment.id);
                break;
            }
        }
    }

    public getCurrentIterationCommentThread(threads: azureGitInterfaces.GitPullRequestCommentThread[]): azureGitInterfaces.GitPullRequestCommentThread | null {
        for (let commentThread of threads) {
            if (this.threadIsFromService(commentThread) && this.getIterationFromServiceCommentThread(commentThread) === this.mostRecentSourceCommitId) {
                tl.debug("comment thread id of thread of current source commit " + this.mostRecentSourceCommitId + ": thread id = " + commentThread.id);
                return commentThread;
            }
        }
        tl.debug("no comment was found for iteration " + this.mostRecentSourceCommitId);
        return null;
    }

    public getCurrentIterationCommentContent(currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread): string {
        if (currentIterationCommentThread && currentIterationCommentThread.comments && currentIterationCommentThread.comments[0]) {
            return currentIterationCommentThread.comments[0].content;
        }
        return null;
    }

    public async getCurrentServiceCommentThreads(apiCaller: AbstractAzureApi) {
        let commentThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await apiCaller.getCommentThreads(this.id, this.repository, this.projectName);
        let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = [];
        for (let commentThread of commentThreads) {
            tl.debug(commentThread.id + " has service properties: " + this.threadHasServiceProperties(commentThread) + " has comments: " + this.threadHasComments(commentThread) + " has comment with correct author: " + this.commentWasWrittenByService(commentThread.comments[0]));
            if (this.threadIsFromService(commentThread)) {
                serviceThreads.push(commentThread);
            }
            else {
                tl.debug("the thread: thread id = " + commentThread.id + " is not from service");
            }
        }
        return serviceThreads;
    }

    private parseDataForMostRecentSourceCommitId(): void {
        this.mostRecentSourceCommitId = null;
        if (this.pullRequestData.lastMergeCommit && this.pullRequestData.lastMergeCommit.commitId) {
           this.mostRecentSourceCommitId = this.pullRequestData.lastMergeCommit.commitId;
        }
    }

    private getIterationFromServiceCommentThread(thread: azureGitInterfaces.GitPullRequestCommentThread): string {
         if (this.threadHasServiceProperties(thread)) {
             return thread.properties[commentProperties.iterationPropertyName].$value;
         }
         return null;
    }

    private threadIsFromService(thread: azureGitInterfaces.GitPullRequestCommentThread): boolean {
        return this.threadHasServiceProperties(thread) && this.threadHasComments(thread)  //&& this.commentWasWrittenByService(thread.comments[0]); Removed until we determine how the author name is selected
    }

    private threadHasServiceProperties(thread: azureGitInterfaces.GitPullRequestCommentThread): boolean {
        return thread.properties && thread.properties[commentProperties.taskPropertyName] && thread.properties[commentProperties.taskPropertyName].$value === commentProperties.taskPropertyValue && thread.properties[commentProperties.iterationPropertyName];
    }

    private commentWasWrittenByService(comment: azureGitInterfaces.Comment): boolean {
        return comment.author.displayName === commentProperties.author;
    }

    private threadHasComments(thread: azureGitInterfaces.GitPullRequestCommentThread): boolean {
        return thread.comments.length > 0;
    } 
}