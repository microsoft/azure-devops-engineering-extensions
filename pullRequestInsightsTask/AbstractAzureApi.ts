import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api/WebApi';
import { IPipeline } from "./IPipeline";
import { EnvironmentConfigurations } from './EnvironmentConfigurations';

export abstract class AbstractAzureApi {
    private connection: WebApi;

    constructor (uri: string, accessKey: string) {
        this.connection = this.createConnection(uri, accessKey);
    }

    public async abstract getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>;

    public async abstract getMostRecentPipelinesOfCurrentType(project: string, currentPipeline: IPipeline, maxNumber: number, branchName: string): Promise<IPipeline[]>;

    public async abstract getDefinition(project: string, definitionId: number): Promise<any>;

    protected getConnection(): WebApi {
        return this.connection;
    }

    public async postNewCommentThread(thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string): Promise<azureGitInterfaces.GitPullRequestCommentThread> {
        return await (await this.getConnection().getGitApi()).createThread(thread, repositoryId, pullRequestId, projectName);
    }

    public async getCommentThreads(pullRequestId: number, repositoryId: string, projectName: string): Promise<azureGitInterfaces.GitPullRequestCommentThread[]> {
        return (await this.getConnection().getGitApi()).getThreads(repositoryId, pullRequestId, projectName);
    }

    public async updateCommentThread(thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string, threadId: number): Promise<azureGitInterfaces.GitPullRequestCommentThread> {
        return (await this.getConnection().getGitApi()).updateThread(thread, repositoryId, pullRequestId, threadId, projectName);
    }

    public async updateComment(comment: azureGitInterfaces.Comment, pullRequestId: number, repositoryId: string, projectName: string, threadId: number, commentId: number): Promise<azureGitInterfaces.Comment> {
        return (await this.getConnection().getGitApi()).updateComment(comment, repositoryId, pullRequestId, threadId, commentId, projectName);
    }

    public async deleteComment(pullRequestId: number, repositoryId: string, projectName: string, threadId: number, commentId: number): Promise<void> {
        (await this.getConnection().getGitApi()).deleteComment(repositoryId, pullRequestId, threadId, commentId, projectName);
    }

    public async getComment(pullRequestId: number, repositoryId: string, projectName: string, threadId: number, commentId: number): Promise<azureGitInterfaces.Comment> {
        return (await this.getConnection().getGitApi()).getComment(repositoryId, pullRequestId, threadId, commentId, projectName)
    }

    public async getPullRequestData(repositoryId: string, pullRequestId: number, projectName: string): Promise<azureGitInterfaces.GitPullRequest> {
        return (await this.getConnection().getGitApi()).getPullRequest(repositoryId, pullRequestId, projectName);
    }

    private createConnection(uri: string, accessToken: string): WebApi {
        let creds = getPersonalAccessTokenHandler(accessToken);
        return new WebApi(uri, creds);
    }
}