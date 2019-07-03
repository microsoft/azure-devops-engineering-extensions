import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { Release } from "./Release";
import tl = require('azure-pipelines-task-lib/task');
import { EnvironmentConfigurations } from "./EnvironmentConfigurations";
import { AbstractPipeline } from "./AbstractPipeline";

export class ReleaseAzureApi extends AbstractAzureApi{

    static readonly DESIRED_RELEASE_ENVIRONMENT_STATUS: number = azureReleaseInterfaces.EnvironmentStatus.Succeeded + azureReleaseInterfaces.EnvironmentStatus.PartiallySucceeded + azureReleaseInterfaces.EnvironmentStatus.Rejected;

    constructor (uri: string, accessKey: string) {
        super(uri, accessKey);
     }
 
     public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<AbstractPipeline> {
         return this.getRelease(configurations.getProjectName(), configurations.getReleaseId()); 
     }
 
     public async getMostRecentPipelinesOfCurrentType(project: string, currentPipeline: AbstractPipeline, maxNumber: number, branchName: string): Promise<AbstractPipeline[]> {
        return this.getReleases(project, currentPipeline.getDefinitionId(), (currentPipeline as Release).getEnvironmentDefinitionId(), ReleaseAzureApi.DESIRED_RELEASE_ENVIRONMENT_STATUS, maxNumber, branchName);
     }

     
    public async getRelease(project: string, releaseId: number): Promise<AbstractPipeline> {
        return new Release(await this.getReleaseData(project, releaseId)); 
    }

    public async getReleases(project: string, definition?: number, environmentDefinition?: number, environmentStatus?: number, maxNumber?: number, branchName?: string):  Promise<AbstractPipeline[]> {
        let releases: Array<AbstractPipeline> = []; 
        let rawReleasesData: azureReleaseInterfaces.Release[] = await (await this.getConnection().getReleaseApi()).getReleases(project, definition, environmentDefinition, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, azureReleaseInterfaces.ReleaseExpands.Environments, undefined, undefined, undefined, branchName);  
        for (let numberRelease = 0; numberRelease < rawReleasesData.length; numberRelease++){
            releases[numberRelease] = new Release(rawReleasesData[numberRelease]);
        }
        return releases;
    }

    public async getDefinition(project: string, definitionId: number): Promise<azureReleaseInterfaces.ReleaseDefinition> {
        return (await this.getConnection().getReleaseApi()).getReleaseDefinition(project, definitionId);
    }

    private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release> {
        return (await this.getConnection().getReleaseApi()).getRelease(project, releaseId); 
    }

}
