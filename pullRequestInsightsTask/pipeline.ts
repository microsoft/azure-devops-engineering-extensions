import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require('azure-pipelines-task-lib/task');

export interface IPipeline{
    // loadData: ()=> void;
   // hasFailed: ()=> boolean; 
    getDefinitionId: ()=> number;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
}

export class Release implements IPipeline{

    // private apiCaller: AzureApi;
    // private project: string;
    // private id: number;
    private static readonly DESIRED_DEPLOYMENT_REASON = azureReleaseInterfaces.DeploymentReason.Automated;
    private releaseData: azureReleaseInterfaces.Release;
    private environmentData: azureReleaseInterfaces.ReleaseEnvironment;

    constructor(releaseData: azureReleaseInterfaces.Release){
        // this.apiCaller = apiCaller;
        // this.project = project;
        // this.id = id;
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
    }

    // public async loadData(): Promise<void> {
    //     this.releaseData = await this.apiCaller.getRelease(this.project, this.id);
    // }
    private getSelectedDeployment(DeploymentAttempts: azureReleaseInterfaces.DeploymentAttempt[]): azureReleaseInterfaces.DeploymentAttempt {
        for (let deployment of DeploymentAttempts){
            if (deployment.reason === Release.DESIRED_DEPLOYMENT_REASON){
                return deployment; 
            }
        }
        throw(new Error("no deployment attempt available"));
    }
    public getDefinitionId(): number{
        return Number(this.releaseData.releaseDefinition.id); 
    }

    public getEnvironmentDefinitionId(): number{
        return Number(this.environmentData.definitionEnvironmentId);
    }

    public isFailure() : boolean{
        if (this.isComplete()){
            //return this.selectDeployment(this.environmentData.deploySteps) === azureReleaseInterfaces.DeploymentStatus.Failed;
        }
        for (let task of this.getSelectedDeployment(this.environmentData.deploySteps).tasks){
            if (this.taskFailed(task)){
                return true;
            }
        }
        return false;
    }
    
    public isComplete(): boolean{
        return this.getSelectedDeployment(this.environmentData.deploySteps).status !== azureReleaseInterfaces.DeploymentStatus.InProgress;
    }

    public getLink(): string{
        return String(this.releaseData._links.web.href);
    }

    public getId(): number{
        return Number(this.releaseData.id);
    }

    private taskFailed(task: azureReleaseInterfaces.ReleaseTask): boolean{
        return task.status === azureReleaseInterfaces.TaskStatus.Failed || task.status === azureReleaseInterfaces.TaskStatus.Failure;
    }
}



export class Build implements IPipeline{

    // private project: string;
    // private id: number;
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
        if (this.isComplete()){
            return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
        }
        if (this.timelineData.records){
            for (let taskRecord of this.timelineData.records){
                if (this.taskFailed(taskRecord)){
                    return true;
                }
            }
        }
        return false;
    }

    public isComplete(): boolean {
        return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
    }

    public getDefinitionId(): number{
        return Number(this.buildData.definition.id);
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