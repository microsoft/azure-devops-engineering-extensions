import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { EnvironmentConfigurations } from "./EnvironmentConfigurations";
import { IPipeline } from "./IPipeline";
import { Release } from "./Release";
import tl = require('azure-pipelines-task-lib/task');

export class ReleaseAzureApi extends AbstractAzureApi{

    constructor (uri: string, accessKey: string) {
        super(uri, accessKey);
     }
 
     public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
         return this.getRelease(configurations.getProjectName(), configurations.getReleaseId()); 
     }
 
     public async getMostRecentPipelinesOfCurrentType(project: string, definition: number, reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        return this.getReleases(project, definition, reason, status, maxNumber, branchName);
     }

     
    public async getRelease(project: string, releaseId: number): Promise<IPipeline>{
        tl.debug("sending for release with project name: " + project + " and release id: " + releaseId);
        return new Release(await this.getReleaseData(project, releaseId)); 
    }

    public async getReleases(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string):  Promise<IPipeline[]>{
        let releases: Array<IPipeline> = []; 
        let rawReleasesData: azureReleaseInterfaces.Release[] = await (await this.getConnection().getReleaseApi()).getReleases(project, definition, undefined, undefined, undefined, status, undefined, undefined, undefined, undefined, maxNumber, undefined, azureReleaseInterfaces.ReleaseExpands.Environments, undefined, undefined, undefined, branchName);  
        for (let numberRelease = 0; numberRelease < rawReleasesData.length; numberRelease++){
            releases[numberRelease] = new Release(rawReleasesData[numberRelease]);
        }
        return releases;
    }

    private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release>{
        return (await this.getConnection().getReleaseApi()).getRelease(project, releaseId); 
    }

}
