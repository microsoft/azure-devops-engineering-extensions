import { IPipeline } from "./IPipeline";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";

export class Build implements IPipeline{

    private buildData: azureBuildInterfaces.Build; 
    private timelineData: azureBuildInterfaces.Timeline;

    constructor(buildData: azureBuildInterfaces.Build, timelineData: azureBuildInterfaces.Timeline) {
        this.buildData = buildData;
        this.timelineData = timelineData;
    }

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

    public getDefinitionId(): number {
        return Number(this.buildData.definition.id);
    }

    public getLink(): string {
        return String(this.buildData._links.web.href);
    }

    public getId(): number {
        return Number(this.buildData.id); 
    }

    public getDisplayName(): string {
        return this.buildData.buildNumber;
    }

    private taskFailed(task: azureBuildInterfaces.TimelineRecord): boolean {
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed; 
    }
} 