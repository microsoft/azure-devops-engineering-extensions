import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require('azure-pipelines-task-lib/task');
import { AzureApi } from "./azureApi";
import { EnvironmentConfigurations } from "./environmentConfigurations";


export interface IPipeline{
    // loadData: ()=> void;
   // hasFailed: ()=> boolean; 
    getDefinitionId: ()=> number;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
}

export class PipelineFactory{

    public async create(apiCaller: AzureApi, type: string, project: string, id: number): Promise<IPipeline>{
        if (type === EnvironmentConfigurations.BUILD){
            return apiCaller.getBuild(project, id); 
        }
        if (type === EnvironmentConfigurations.RELEASE){
            return apiCaller.getRelease(project, id); 
        }
        throw(new Error(`ERROR: CANNOT RUN FOR HOST TYPE ${type}`));
    }
}

export class Release implements IPipeline{

    // private apiCaller: AzureApi;
    // private project: string;
    // private id: number;
    private releaseData: azureReleaseInterfaces.Release; 

    constructor(releaseData: azureReleaseInterfaces.Release){
        // this.apiCaller = apiCaller;
        // this.project = project;
        // this.id = id;
        this.releaseData = releaseData;
    }

    // public async loadData(): Promise<void> {
    //     this.releaseData = await this.apiCaller.getRelease(this.project, this.id);
    // }
    public getDefinitionId(): number{
        return 1; 
    }

    public isFailure() : boolean{
        return true;
    }

    public isComplete(): boolean{
        return true;
    }

    public getLink(): string{
        return String(this.releaseData._links.web.href);
    }

    public getId(): number{
        return Number(this.releaseData.id);
    }
}



export class Build implements IPipeline{

    private apiCaller: AzureApi;
    private project: string;
    private id: number;
    private buildData: azureBuildInterfaces.Build; 
    private timelineData: azureBuildInterfaces.Timeline;

    constructor(buildData: azureBuildInterfaces.Build, timelineData: azureBuildInterfaces.Timeline){
        // this.apiCaller = apiCaller;
        // this.project = project;
        this.buildData = buildData;
        this.timelineData = timelineData;
    }

    // public async loadData(): Promise<void> {
    //     this.buildData = await this.apiCaller.getBuild(this.project, this.id);
    //     this.timelineData = await this.apiCaller.getBuildTimeline(this.project, this.id);
    // }

    // public hasFailed() : boolean{
    //     return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
    // }

    public isFailure() : boolean {
        let failed = false;
        if (this.timelineData.records !== undefined){
            this.timelineData.records.forEach(taskRecord => {
                if (this.taskFailed(taskRecord)){
                    failed = true;
                }
            }); 
        }
        return failed;
    }

    public isComplete(): boolean {
        return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
    }

    public getDefinitionId(): number{
        if (this.buildData.definition !== undefined && this.buildData.definition.id !== undefined){
            return this.buildData.definition.id;
        }
        throw(new Error("no definition available"));            
    }

    public getLink(): string{
        return String(this.buildData._links.web.href);
    }

    public getId(): number{
        return Number(this.buildData.id); 
    }

    private taskFailed(task: azureBuildInterfaces.TimelineRecord): boolean{
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed; 
    }
} 