import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import messages from './user_messages.json';
import { AbstractAzureApi } from "./AbstractAzureApi.js";
import tl = require('azure-pipelines-task-lib/task');
import { IPipeline } from "./IPipeline.js";
import { EnvironmentConfigurations } from "./EnvironmentConfigurations.js";
import { Branch } from "./Branch.js";

export class PullRequest {

    private id: number;
    private repository: string;
    private projectName: string;
    private static readonly COMMENT = messages.failureComment;

    constructor(id: number, repository: string, projectName: string) {
        this.id = id;
        this.repository = repository;
        this.projectName = projectName;
    }


    public async manageFailureComments(apiCaller: AbstractAzureApi, currentBuildIteration: string): Promise<void> {
        // let currentServiceComments = this.getCurrentServiceComments(await apiCaller.getCommentThreads(this.id, this.repository, this.projectName));
        // let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = this.getCurrentIterationCommentThread(currentServiceComments, currentBuildIteration);
        // let currentIterationCommentId: number;
        // if (currentIterationCommentThread && currentIterationCommentThread.id){
        //     currentIterationCommentId = currentIterationCommentThread.id;
        //     this.editCommentThread(apiCaller, currentIterationCommentThread);
        // }
        // tl.debug("current build iteration: " + currentBuildIteration + " and comment id for this iteration: " + currentIterationCommentId);
        // this.deactivateOldComments(apiCaller, currentIterationCommentId);
    }

    public async addNewComment(apiCaller: AbstractAzureApi, commentContent: string): Promise<azureGitInterfaces.GitPullRequestCommentThread>{
        let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: commentContent})};
        tl.debug(messages.commentCompletedMessage);
        return apiCaller.postNewCommentThread(thread, this.id, this.repository, this.projectName);
    }

    public async deactivateOldComments(apiCaller: AbstractAzureApi, currentIterationCommentId: number): Promise<void> {
        let serviceComments: azureGitInterfaces.GitPullRequestCommentThread[] = this.getCurrentServiceComments(await apiCaller.getCommentThreads(this.id, this.repository, this.projectName));
        for (let commentThread of serviceComments) {
            if (commentThread.id != currentIterationCommentId && (commentThread.status === azureGitInterfaces.CommentThreadStatus.Active || commentThread.status === undefined)) {
                tl.debug("comment to be deactivated: " + commentThread.id);
                apiCaller.updateCommentThread({status: azureGitInterfaces.CommentThreadStatus.Closed}, this.id, this.repository, this.projectName, commentThread.id);
            }
        }
    }

    public editCommentThread(apiCaller: AbstractAzureApi, thread: azureGitInterfaces.GitPullRequestCommentThread): void {
        tl.debug("editing comment")
        for (let numberComment = 0; numberComment < thread.comments.length; numberComment++){
            if (this.commentIsFromService(thread.comments[numberComment].content, messages.failureCommentHeading) && this.getBuildIterationFromServiceComment(thread.comments[numberComment].content)){
                thread.comments[numberComment] = {content: thread.comments[numberComment].content + this.format(messages.failureCommentRow, "t", "t", "t", "t")};
                tl.debug("new comment = " + thread.comments[numberComment].content);
            }
        }
        apiCaller.updateCommentThread({comments: thread.comments}, this.id, this.repository, this.projectName, thread.id);
    }

    public async getCurrentIterationCommentThread(apiCaller: AbstractAzureApi, currentBuildIteration: string): Promise<azureGitInterfaces.GitPullRequestCommentThread | null> {
        for (let commentThread of this.getCurrentServiceComments(await apiCaller.getCommentThreads(this.id, this.repository, this.projectName))){
            for (let comment of commentThread.comments){
                if (this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration){
                    tl.debug("current iteration comment content: " + comment.content)
                    return commentThread;
                }
            }
        }
        return null;
    }

    private  format(text: string, ...args: string[]): string {
        return text.replace(/{(\d+)}/g, (match, num) => {
          return typeof args[num] !== 'undefined' ? args[num] : match;
        });
      }

    private getBuildIterationFromServiceComment(serviceCommentContent: string){
        let splitContent = serviceCommentContent.split("\|")
        splitContent.shift();
        if (splitContent.length > 0){
           // tl.debug((splitContent[0].split(" ").slice(2)).join(" "));
            return (splitContent[0].split(" ").slice(2)).join(" ");  
        }
        return null;
    }

    private getCurrentServiceComments(commentThreads: azureGitInterfaces.GitPullRequestCommentThread[]): azureGitInterfaces.GitPullRequestCommentThread[] {
        let currentServiceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = [];
        for (let commentThread of commentThreads) {
            for (let comment of commentThread.comments) {
                if (this.commentIsFromService(comment.content, PullRequest.COMMENT)) {
                    tl.debug("the comment " + comment.content + " is from service");
                    currentServiceThreads.push(commentThread);
                }
            }
        }
        return currentServiceThreads;
    }

    private commentIsFromService(commentContent: string, commentFormatString: string): boolean {
        // tl.debug("regex = " + this.convertCommentFormatToRegex(commentFormatString) + " actual comment " + commentContent);
       return this.convertCommentFormatToRegex(commentFormatString).test(commentContent);
    }

    private convertCommentFormatToRegex(commentFormatString: string): RegExp {
        let regex: string = commentFormatString.split("\n")[0];
        regex = regex.replace(/{(\d+)}/g, ".*").replace(/\|/g, '\\|'); 
        // tl.debug("format string regex: " + new RegExp(regex));
        return new RegExp(regex);
    }





}