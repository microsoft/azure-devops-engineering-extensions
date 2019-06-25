import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import messages from "./user_messages.json";
import commentProperties from "./service_comment_properties.json";
import { AbstractAzureApi } from "./AbstractAzureApi.js";
import tl = require('azure-pipelines-task-lib/task');

export class PullRequest {

    private id: number;
    private repository: string;
    private projectName: string;

    constructor(id: number, repository: string, projectName: string) {
        this.id = id;
        this.repository = repository;
        this.projectName = projectName;    
    }

    public async addNewComment(apiCaller: AbstractAzureApi, commentContent: string, buildIteration: string): Promise<azureGitInterfaces.GitPullRequestCommentThread>{
        let properties: any = {fromTask: commentProperties.taskPropertyValue, buildIteration: buildIteration};
        let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: commentContent}), properties: properties};
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

    public editCommentInThread(apiCaller: AbstractAzureApi, thread: azureGitInterfaces.GitPullRequestCommentThread, commentId: number, contentToAdd: string): void {
        for (let comment of thread.comments) {
            console.log("comment id = " + comment.id)
            if (comment.id === commentId) {
                let updatedContent: string = comment.content + contentToAdd;
                tl.debug("comment to be updated: thread id = " + thread.id + ", comment id = " + comment.id);
                apiCaller.updateComment({ content: updatedContent }, this.id, this.repository, this.projectName, thread.id, comment.id);
                break;
            }
        }
    }

    public getCurrentIterationCommentThread(threads: azureGitInterfaces.GitPullRequestCommentThread[], currentBuildIteration: string): azureGitInterfaces.GitPullRequestCommentThread | null {
        for (let commentThread of threads) {
            if (this.threadIsFromService(commentThread) && this.getBuildIterationFromServiceCommentThread(commentThread) === currentBuildIteration) {
                tl.debug("comment thread id of thread of current build iteration " + currentBuildIteration + ": thread id = " + commentThread.id);
                return commentThread;
            }
        }
        tl.debug("no comment was found for build iteration " + currentBuildIteration);
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

    private getBuildIterationFromServiceCommentThread(thread: azureGitInterfaces.GitPullRequestCommentThread): string {
         if (this.threadHasServiceProperties(thread)) {
             return thread.properties.buildIteration.$value;
         }
         return null;
    }

    private threadIsFromService(thread: azureGitInterfaces.GitPullRequestCommentThread): boolean {
        return this.threadHasServiceProperties(thread) && this.threadHasComments(thread) && this.commentWasWrittenByService(thread.comments[0]);
    }

    private threadHasServiceProperties(thread: azureGitInterfaces.GitPullRequestCommentThread): boolean {
        return thread.properties && thread.properties.fromTask && thread.properties.fromTask.$value === commentProperties.taskPropertyValue && thread.properties.buildIteration;
    }

    private commentWasWrittenByService(comment: azureGitInterfaces.Comment): boolean {
        return comment.author.displayName === commentProperties.author;
    }

    private threadHasComments(thread: azureGitInterfaces.GitPullRequestCommentThread): boolean {
        return thread.comments.length > 0;
    } 
}