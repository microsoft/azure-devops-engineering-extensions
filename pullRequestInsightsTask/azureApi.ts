import tl = require('azure-pipelines-task-lib/task');
import * as azureGitApi from "azure-devops-node-api/GitApi";
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api/WebApi';
import { BuildApi } from 'azure-devops-node-api/BuildApi';

export class AzureApi{ // might change class/structure

    private connection: WebApi;
    private gitApi: azureGitApi.GitApi;
    private buildApi: BuildApi;

    constructor (teamFoundationUri: string, accessKey: string) {
        this.connection = this.createConnection(teamFoundationUri, accessKey);
    }

    public async postNewCommentThread (thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string){
        await this.checkForGitApi();
        this.gitApi.createThread(thread, repositoryId, pullRequestId, projectName);
    }

    public async getBuild(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
        await this.checkForBuildApi();
        return this.buildApi.getBuild(project, buildId);
    }

    public async getBuilds(project: string, definitions?: number[], reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<azureBuildInterfaces.Build[]>{
        await this.checkForBuildApi();
        return this.buildApi.getBuilds(project, definitions, undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
    }
    
    public async getBuildTimeline(project: string, buildId: number): Promise<azureBuildInterfaces.Timeline>{
        await this.checkForBuildApi();
        return this.buildApi.getBuildTimeline(project, buildId); 
    }
    
    private async checkForGitApi(){
        if (!this.gitApi){
            this.gitApi = await this.connection.getGitApi();
        }
    }

    private async checkForBuildApi(){
        if (!this.buildApi){
            this.buildApi = await this.connection.getBuildApi();
        }
    }

    private createConnection(teamFoundationUri: string, accessToken: string): WebApi {
        let creds = getPersonalAccessTokenHandler(accessToken);
        return new WebApi(teamFoundationUri, creds);
    }
}