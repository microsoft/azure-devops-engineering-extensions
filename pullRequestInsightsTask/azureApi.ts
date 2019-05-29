import tl = require('azure-pipelines-task-lib/task');
import * as azureGitApi from "azure-devops-node-api/GitApi";
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api/WebApi';
import { BuildApi } from 'azure-devops-node-api/BuildApi';
import {Build, Release} from "./pipeline";

export class AzureApi{ 

    private connection: WebApi;
    private gitApi: azureGitApi.GitApi;
    private buildApi: BuildApi;

    constructor (teamFoundationUri: string, accessKey: string) {
        this.connection = this.createConnection(teamFoundationUri, accessKey);
    }

    public async postNewCommentThread (thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string){
        (await this.connection.getGitApi()).createThread(thread, repositoryId, pullRequestId, projectName);
    }

    public async getBuild(project: string, buildId: number): Promise<Build>{
        //return (await this.connection.getBuildApi()).getBuild(project, buildId);
        return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
    }

    public async getBuilds(project: string, definitions?: number[], reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<Build[]>{
        let builds: Array<Build> = []; 
        let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.connection.getBuildApi()).getBuilds(project, definitions, undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
        for (let numberBuild = 0; numberBuild < rawBuildsData.length; numberBuild++){
            let id: number = Number(rawBuildsData[numberBuild].id);
            builds[numberBuild] = new Build(await this.getBuildData(project, id), await this.getBuildTimeline(project, id));
    }
    return builds;
}
    
    private async getBuildData(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
        return (await this.connection.getBuildApi()).getBuild(project, buildId);
    }
    private async getBuildTimeline(project: string, buildId: number): Promise<azureBuildInterfaces.Timeline>{
        return (await this.connection.getBuildApi()).getBuildTimeline(project, buildId); 
    }
    
    public async getRelease(project: string, releaseId: number): Promise<Release>{
        return new Release(await this.getReleaseData(project, releaseId)); 
    }

    private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release>{
        return (await this.connection.getReleaseApi()).getRelease(project, releaseId); 
    }

    private createConnection(teamFoundationUri: string, accessToken: string): WebApi {
        let creds = getPersonalAccessTokenHandler(accessToken);
        return new WebApi(teamFoundationUri, creds);
    }
}