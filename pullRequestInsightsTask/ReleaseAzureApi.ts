import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { EnvironmentConfigurations } from "./EnvironmentConfigurations";
import { IPipeline } from "./IPipeline";
import { Release } from "./Release";
import tl = require('azure-pipelines-task-lib/task');

export class ReleaseAzureApi extends AbstractAzureApi{

    static readonly DESIRED_RELEASE_ENVIRONMENT_STATUS: number = azureReleaseInterfaces.EnvironmentStatus.Succeeded + azureReleaseInterfaces.EnvironmentStatus.PartiallySucceeded + azureReleaseInterfaces.EnvironmentStatus.Rejected;

    constructor (uri: string, accessKey: string) {
        super(uri, accessKey);
     }
 
     public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline> {
         return this.getRelease(configurations.getProjectName(), configurations.getReleaseId()); 
     }
 
     public async getMostRecentPipelinesOfCurrentType(project: string, currentPipeline: IPipeline, maxNumber: number, branchName: string): Promise<IPipeline[]> {
        return this.getReleases(project, currentPipeline.getDefinitionId(), (currentPipeline as Release).getEnvironmentDefinitionId(), ReleaseAzureApi.DESIRED_RELEASE_ENVIRONMENT_STATUS, maxNumber, branchName);
     }

     
    public async getRelease(project: string, releaseId: number): Promise<IPipeline> {
        return new Release(await this.getReleaseData(project, releaseId)); 
    }

    public async getReleases(project: string, definition?: number, environmentDefinition?: number, environmentStatus?: number, maxNumber?: number, branchName?: string):  Promise<IPipeline[]> {
        let releases: Array<IPipeline> = []; 
        let rawReleasesData: azureReleaseInterfaces.Release[] = await (await this.getConnection().getReleaseApi()).getReleases(project, definition, environmentDefinition, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, azureReleaseInterfaces.ReleaseExpands.Environments, undefined, undefined, undefined, branchName);  
        for (let numberRelease = 0; numberRelease < rawReleasesData.length; numberRelease++){
            releases[numberRelease] = new Release(rawReleasesData[numberRelease]);
        }
        return releases;
    }

    private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release> {
        return (await this.getConnection().getReleaseApi()).getRelease(project, releaseId); 
    }

}
