import { AbstractAzureApi } from "./AbstractAzureApi";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { AbstractPipeline } from "./AbstractPipeline";
import { Build } from "./Build";
import { PipelineData } from "./PipelineData";
import tl = require('azure-pipelines-task-lib/task');


export class BuildAzureApi extends AbstractAzureApi{ 

    static readonly DESIRED_BUILD_STATUS: number = azureBuildInterfaces.BuildStatus.Completed;

    constructor (uri: string, accessKey: string) {
       super(uri, accessKey);
    }

    public async getCurrentPipeline(data: PipelineData): Promise<AbstractPipeline>{
        return await this.getBuild(data.getProjectName(), data.getBuildId()); 
    }

    public async getMostRecentPipelinesOfCurrentType(project: string, currentPipeline: AbstractPipeline, maxNumber: number, branchName: string): Promise<AbstractPipeline[]>{
        return this.getBuilds(project, currentPipeline.getDefinitionId(), BuildAzureApi.DESIRED_BUILD_STATUS, maxNumber, branchName);
    }

    public async getBuild(project: string, buildId: number): Promise<AbstractPipeline> {
        return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
    }

    public async getDefinition(project: string, definitionId: number): Promise<azureBuildInterfaces.BuildDefinition> {
        return (await this.getConnection().getBuildApi()).getDefinition(project, definitionId);
    }

    public async getBuilds(project: string, definition?: number, status?: number, maxNumber?: number, branchName?: string): Promise<AbstractPipeline[]>{
        tl.debug(`getting builds with: ${project}, ${definition}, ${status}, ${maxNumber}, ${branchName}`)
        let builds: Array<AbstractPipeline> = []; 
        let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.getConnection().getBuildApi()).getBuilds(project, [definition], undefined, undefined, undefined, undefined, undefined, undefined, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName); 
        tl.debug("builds: " + rawBuildsData) 
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

