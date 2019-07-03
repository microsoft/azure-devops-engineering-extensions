import { AbstractPipelineTask } from "./AbstractPipelineTask";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";

export class BuildTask extends AbstractPipelineTask {

    private buildTaskRecord: azureBuildInterfaces.TimelineRecord;

    constructor(buildTaskRecord: azureBuildInterfaces.TimelineRecord) {
        super(buildTaskRecord.name, buildTaskRecord.id, buildTaskRecord.startTime, buildTaskRecord.finishTime);
        this.buildTaskRecord = buildTaskRecord;
    }
   
    protected hasCompleteStatus(): boolean {
        return this.buildTaskRecord.state === azureBuildInterfaces.TimelineRecordState.Completed;
    }

    public wasFailure(): boolean {
        return this.buildTaskRecord.result === azureBuildInterfaces.TaskResult.Failed;
    }

}