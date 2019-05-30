import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { EnvironmentConfigurations } from "./EnvironmentConfigurations";
import { IPipeline } from "./IPipeline";

export class ReleaseAzureApi extends AbstractAzureApi{

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
