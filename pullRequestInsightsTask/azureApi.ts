import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api/WebApi';
import {Build, Release, IPipeline} from "./pipeline";
import { EnvironmentConfigurations } from './environmentConfigurations';

export class AzureApiFactory{
    private static readonly BUILD = "build";
    private static readonly RELEASE = "release";
    public async create(configurations: EnvironmentConfigurations): Promise<AzureApi>{
     let type: string = configurations.getHostType();
     tl.debug("host type: " + type);
        if (type === AzureApiFactory.BUILD){
            return new BuildAzureApi(configurations.getTeamURI(), configurations.getAccessKey()); 
        }
        if (type === AzureApiFactory.RELEASE){
            return new ReleaseAzureApi(configurations.getTeamURI(), configurations.getAccessKey()); 
       }
       throw(new Error(`ERROR: CANNOT RUN FOR HOST TYPE ${type}`));
    }
}


export abstract class AzureApi{
    private connection: WebApi;

    constructor (uri: string, accessKey: string) {
        this.connection = this.createConnection(uri, accessKey);
    }

    public async abstract getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>;

    public async abstract getMostRecentPipelinesOfCurrentType(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string): Promise<IPipeline[]>;

    protected getConnection(): WebApi{
        return this.connection;
    }

    public async getBuild(project: string, buildId: number): Promise<IPipeline>{
        return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
    }

    public async getBuilds(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        let builds: Array<IPipeline> = []; 
        let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.connection.getBuildApi()).getBuilds(project, Array(definition), undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
        for (let numberBuild = 0; numberBuild < rawBuildsData.length; numberBuild++){
            let id: number = Number(rawBuildsData[numberBuild].id);
            builds[numberBuild] = new Build(rawBuildsData[numberBuild], await this.getBuildTimeline(project, id));
        }
        return builds;
    }

    public async getRelease(project: string, releaseId: number): Promise<IPipeline>{
        return new Release(await this.getReleaseData(project, releaseId)); 
    }

    public async getReleases(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string):  Promise<IPipeline[]>{
        let releases: Array<IPipeline> = []; 
        let rawReleasesData: azureReleaseInterfaces.Release[] = await (await this.connection.getReleaseApi()).getReleases(project, definition, undefined, undefined, undefined, status, undefined, undefined, undefined, undefined, maxNumber, undefined, azureReleaseInterfaces.ReleaseExpands.Environments, undefined, undefined, undefined, branchName);  
        for (let numberRelease = 0; numberRelease < rawReleasesData.length; numberRelease++){
            releases[numberRelease] = new Release(rawReleasesData[numberRelease]);
        }
        return releases;
    }

    public async postNewCommentThread(thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string): Promise<void>{
        (await this.getConnection().getGitApi()).createThread(thread, repositoryId, pullRequestId, projectName);
    }

    public async getPullRequestData(repositoryId: string, pullRequestId: number): Promise<azureGitInterfaces.GitPullRequest>{
        return (await this.getConnection().getGitApi()).getPullRequest(repositoryId, pullRequestId);
    }

    private async getBuildData(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
        return (await this.getConnection().getBuildApi()).getBuild(project, buildId);
    }
    private async getBuildTimeline(project: string, buildId: number): Promise<azureBuildInterfaces.Timeline>{
        return (await this.getConnection().getBuildApi()).getBuildTimeline(project, buildId); 
    }

    private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release>{
        return (await this.getConnection().getReleaseApi()).getRelease(project, releaseId); 
    }

    private createConnection(uri: string, accessToken: string): WebApi {
        let creds = getPersonalAccessTokenHandler(accessToken);
        return new WebApi(uri, creds);
    }
}


export class ReleaseAzureApi extends AzureApi{

    constructor (uri: string, accessKey: string) {
        super(uri, accessKey);
     }
 
     public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
         return this.getRelease(configurations.getProjectName(), configurations.getReleaseId()); 
     }
 
     public async getMostRecentPipelinesOfCurrentType(project: string, definition: number, reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        return this.getBuilds(project, definition, reason, status, maxNumber, branchName);
     }
}


export class BuildAzureApi extends AzureApi{ 

    constructor (uri: string, accessKey: string) {
       super(uri, accessKey);
    }

    public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
        return this.getBuild(configurations.getProjectName(), configurations.getBuildId()); 
    }

    public async getMostRecentPipelinesOfCurrentType(project: string, definition: number, reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        return this.getBuilds(project, definition, reason, status, maxNumber, branchName);
    }
}













//     public async postNewCommentThread (thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string): Promise<void>{
//         (await this.getConnection().getGitApi()).createThread(thread, repositoryId, pullRequestId, projectName);
//     }

//     public async getBuild(project: string, buildId: number): Promise<Build>{
//         return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
//     }

//     public async getBuilds(project: string, definitions?: number[], reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<Build[]>{
//         let builds: Array<Build> = []; 
//         let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.connection.getBuildApi()).getBuilds(project, definitions, undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
//         for (let numberBuild = 0; numberBuild < rawBuildsData.length; numberBuild++){
//             let id: number = Number(rawBuildsData[numberBuild].id);
//             builds[numberBuild] = new Build(await this.getBuildData(project, id), await this.getBuildTimeline(project, id));
//     }
//     return builds;
// }
    
//     private async getBuildData(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
//         return (await this.getConnection().getBuildApi()).getBuild(project, buildId);
//     }
//     private async getBuildTimeline(project: string, buildId: number): Promise<azureBuildInterfaces.Timeline>{
//         return (await this.getConnection().getBuildApi()).getBuildTimeline(project, buildId); 
//     }
    
//     public async getRelease(project: string, releaseId: number): Promise<Release>{
//         return new Release(await this.getReleaseData(project, releaseId)); 
//     }

//     private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release>{
//         return (await this.getConnection().getReleaseApi()).getRelease(project, releaseId); 
//     }

    // public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
    //     //let type: string = configurations.getHostType();
    //     //if (type === AzureApi.BUILD){
    //         return this.getBuild(configurations.getProjectName(), configurations.getBuildId()); 
    //     }
        //if (type === AzureApi.RELEASE){
       //     return this.getRelease(configurations.getProjectName(), configurations.getReleaseId()); 
       // }
       // throw(new Error(`ERROR: CANNOT RUN FOR HOST TYPE ${type}`));
    //}

    // private createConnection(teamFoundationUri: string, accessToken: string): WebApi {
    //     let creds = getPersonalAccessTokenHandler(accessToken);
    //     return new WebApi(teamFoundationUri, creds);
    // }
//}