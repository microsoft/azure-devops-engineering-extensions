import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import messages from './user_messages.json';
import { AbstractAzureApi } from "./AbstractAzureApi.js";
import tl = require('azure-pipelines-task-lib/task');

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
        let currentServiceComments = this.getCurrentServiceComments(await apiCaller.getCommentThreads(this.id, this.repository, this.projectName));
        let currentIterationCommentId: number = this.getCurrentIterationCommentId(currentServiceComments, currentBuildIteration);
        tl.debug("current build iteration: " + currentBuildIteration + " and comment id for this iteration: " + currentIterationCommentId);
        this.deactivateOldComments(apiCaller, currentIterationCommentId);
        this.editComment(apiCaller, currentIterationCommentId);
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

    public editComment(apiCaller: AbstractAzureApi, currentIterationCommentId: number): void {

    }

    public getCurrentIterationCommentId(commentThreads: azureGitInterfaces.GitPullRequestCommentThread[], currentBuildIteration: string): number | null {
        for (let commentThread of this.getCurrentServiceComments(commentThreads)){
            for (let comment of commentThread.comments){
                if (this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration){
                    tl.debug("current iteration comment content: " + comment.content)
                    return commentThread.id;
                }
            }
        }
        return null;
    }


    private getBuildIterationFromServiceComment(serviceCommentContent: string){
        let splitContent = serviceCommentContent.split("\|")
        splitContent.shift();
        if (splitContent.length > 0){
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