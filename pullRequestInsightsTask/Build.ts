import { IPipeline } from "./IPipeline";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import tl = require('azure-pipelines-task-lib/task');

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
        for (let taskRecord of this.timelineData.records){
            if (this.taskRan(taskRecord) && this.taskFailed(taskRecord)){
                return true;
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

    public getTaskLength(taskId: string): number | null{
        for (let taskRecord of this.timelineData.records) {
            if (taskRecord.id === taskId && this.taskRan(taskRecord)){
                tl.debug("task: " + taskId + " " + taskRecord.startTime.getTime() + " " + taskRecord.finishTime.getTime() + " " + (taskRecord.finishTime.getTime() - taskRecord.startTime.getTime()));
                return taskRecord.finishTime.getTime() - taskRecord.startTime.getTime();
            }
        }
        return null;
    }

    public getTaskIds(): string[] {
        if (!this.timelineData.records) {
            return null;
        }
        let taskIds: string[] = [];
        for (let taskRecord of this.timelineData.records) {
            taskIds.push(taskRecord.id);
        }
        return taskIds;
    }

    public getLongRunningValidations(taskThresholdTimes: Map<string, number>): Map<string, number> {
        let longRunningValidations: Map<string, number> = new Map(); 
        for (let taskId of this.getTaskIds()) {
            if (taskThresholdTimes.get(taskId) && this.getTaskLength(taskId) > taskThresholdTimes.get(taskId)) {
                longRunningValidations.set(taskId, this.getTaskLength(taskId));
            }
        }
        return longRunningValidations;
    }

    private taskRan(task: azureBuildInterfaces.TimelineRecord): boolean {
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.startTime !== null && task.finishTime !== null;
    }

    private taskFailed(task: azureBuildInterfaces.TimelineRecord): boolean {
        return task.result === azureBuildInterfaces.TaskResult.Failed; 
    }
} 