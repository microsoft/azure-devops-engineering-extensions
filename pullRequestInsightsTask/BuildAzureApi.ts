import { AbstractAzureApi } from "./AbstractAzureApi";
import { EnvironmentConfigurations } from "./EnvironmentConfigurations";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IPipeline } from "./IPipeline";
import { Build } from "./Build";

export class BuildAzureApi extends AbstractAzureApi{ 

    constructor (uri: string, accessKey: string) {
       super(uri, accessKey);
    }

    public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
        return this.getBuild(configurations.getProjectName(), configurations.getBuildId()); 
    }

    public async getMostRecentPipelinesOfCurrentType(project: string, definition: number, reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        return this.getBuilds(project, definition, reason, status, maxNumber, branchName);
    }

    public async getBuild(project: string, buildId: number): Promise<IPipeline>{
        return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
    }

    public async getBuilds(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        let builds: Array<IPipeline> = []; 
        let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.getConnection().getBuildApi()).getBuilds(project, Array(definition), undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
        for (let numberBuild = 0; numberBuild < rawBuildsData.length; numberBuild++){
            let id: number = Number(rawBuildsData[numberBuild].id);
            builds[numberBuild] = new Build(rawBuildsData[numberBuild], await this.getBuildTimeline(project, id));
        }
        return builds;
    }

    private async getBuildData(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
        return (await this.getConnection().getBuildApi()).getBuild(project, buildId);
    }
    private async getBuildTimeline(project: string, buildId: number): Promise<azureBuildInterfaces.Timeline>{
        return (await this.getConnection().getBuildApi()).getBuildTimeline(project, buildId); 
    }


}

