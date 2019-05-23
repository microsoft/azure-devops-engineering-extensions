import tl = require('azure-pipelines-task-lib/task');
import * as azureGitApi from "azure-devops-node-api/GitApi";
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api/WebApi';
import { EnvironmentConfigurations } from './environmentConfigurations';

export class AzureApi{

    private connection : WebApi;

    constructor (teamFoundationUri: string, accessKey: string) {
        this.connection = this.createConnection(teamFoundationUri, accessKey);
    }

    public async postNewCommentThread (thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string){
        let gitApi = await this.connection.getGitApi();
        gitApi.createThread(thread, repositoryId, pullRequestId, projectName);
    }

    public async getBuild(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
        let buildApi = await this.connection.getBuildApi();
        return buildApi.getBuild(project, buildId);
    }

    private createConnection(teamFoundationUri: string, accessToken: string): WebApi {
        console.log("team foundation uri = ", teamFoundationUri);
        let creds = getPersonalAccessTokenHandler(accessToken);
        return new WebApi(teamFoundationUri, creds);
    }
}