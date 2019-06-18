import { AbstractAzureApi } from "./AbstractAzureApi";
import { EnvironmentConfigurations } from "./EnvironmentConfigurations";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IPipeline } from "./IPipeline";
import { Build } from "./Build";
import tl = require('azure-pipelines-task-lib/task');

export class BuildAzureApi extends AbstractAzureApi{ 

    static readonly DESIRED_BUILD_REASON: number = azureBuildInterfaces.BuildReason.BatchedCI + azureBuildInterfaces.BuildReason.IndividualCI;
    static readonly DESIRED_BUILD_STATUS: number = azureBuildInterfaces.BuildStatus.Completed;

    constructor (uri: string, accessKey: string) {
       super(uri, accessKey);
    }

    public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
        return await this.getBuild(configurations.getProjectName(), configurations.getBuildId()); 
    }

    public async getMostRecentPipelinesOfCurrentType(project: string, currentPipeline: IPipeline, maxNumber: number, branchName: string): Promise<IPipeline[]>{
        return await this.getBuilds(project, currentPipeline.getDefinitionId(), BuildAzureApi.DESIRED_BUILD_REASON, BuildAzureApi.DESIRED_BUILD_STATUS, maxNumber, branchName);
    }

    public async getBuild(project: string, buildId: number): Promise<IPipeline>{
        return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
    }

    public async getBuilds(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string): Promise<IPipeline[]>{
        let builds: Array<IPipeline> = []; 
        let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.getConnection().getBuildApi()).getBuilds(project, Array(definition), undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
        for (let buildData of rawBuildsData) {
            let timeline: azureBuildInterfaces.Timeline = await this.getBuildTimeline(project, buildData.id);
            if (timeline !== null){
               builds.push(new Build(buildData, timeline));
            }
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

