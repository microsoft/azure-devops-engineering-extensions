import { IPipelineTask } from "./IPipelineTask";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";


export class BuildTask implements IPipelineTask {

    private record: azureBuildInterfaces.TimelineRecord;

    constructor(buildTaskRecord: azureBuildInterfaces.TimelineRecord) {
        this.record = buildTaskRecord;
    }

    public getDuration(): number {
        if (this.ran()) {
            return this.getFinishTime() - this.getStartTime();
        }
        return null;
    }

    public getName(): string {
        return this.record.name;
    }

    public isLongRunning(thresholdTime: number): boolean {
        let taskLength = this.getDuration();
        if (thresholdTime != null && taskLength > thresholdTime) {
            return true;
        }
        return false;
    }

    public ran(): boolean {
        return (this.record.state === azureBuildInterfaces.TimelineRecordState.Completed) && this.getStartTime() != null && this.getFinishTime() != null;
    }

    public wasFailure(): boolean {
        return this.record.result === azureBuildInterfaces.TaskResult.Failed;
    }

    public equals(other: IPipelineTask): boolean {
        return this.getName() === other.getName() && this.getId() === other.getId();
    }

    public getId(): string {
       return this.record.id;
    }

    private getStartTime(): number {
        return this.getTimeFromDate(this.record.startTime);
    }

    private getFinishTime(): number {
        return this.getTimeFromDate(this.record.finishTime);
    }

    private getTimeFromDate(date: Date) {
        if (date) {
            return date.getTime();
        }
        return null;
    }
}