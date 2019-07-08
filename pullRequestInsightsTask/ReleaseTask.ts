import { AbstractPipelineTask } from "./AbstractPipelineTask";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require('azure-pipelines-task-lib/task');



export class ReleaseTask extends AbstractPipelineTask {

    private releaseTaskRecord: azureReleaseInterfaces.ReleaseTask;
    private static readonly COMPLETE_TASK_STATUSES: azureReleaseInterfaces.TaskStatus[] = [azureReleaseInterfaces.TaskStatus.Failed, azureReleaseInterfaces.TaskStatus.Failure, azureReleaseInterfaces.TaskStatus.PartiallySucceeded, azureReleaseInterfaces.TaskStatus.Succeeded, azureReleaseInterfaces.TaskStatus.Success]
    private static readonly FAILED_TASK_STATUSES: azureReleaseInterfaces.TaskStatus[] = [azureReleaseInterfaces.TaskStatus.Failed, azureReleaseInterfaces.TaskStatus.Failure]


    constructor(releaseTaskRecord: azureReleaseInterfaces.ReleaseTask) {
        super(releaseTaskRecord.name, String(releaseTaskRecord.id), releaseTaskRecord.startTime, releaseTaskRecord.finishTime);
        tl.debug("release task: " +  releaseTaskRecord.name + " " + String(releaseTaskRecord.id));
        this.releaseTaskRecord = releaseTaskRecord;
    }
   
    protected hasCompleteStatus(): boolean {
        return this.currentStatusIsIncluded(ReleaseTask.COMPLETE_TASK_STATUSES);
    }

    public wasFailure(): boolean {
        return this.currentStatusIsIncluded(ReleaseTask.FAILED_TASK_STATUSES);
    }

    private currentStatusIsIncluded(statusesToCheck: azureReleaseInterfaces.TaskStatus[]) {
        return statusesToCheck.includes(this.releaseTaskRecord.status);
    }

}
