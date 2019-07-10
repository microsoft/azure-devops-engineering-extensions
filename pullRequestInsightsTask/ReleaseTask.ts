import { AbstractPipelineTask } from "./AbstractPipelineTask";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require('azure-pipelines-task-lib/task');
import { ITaskReference } from "./ITaskReference";



export class ReleaseTask extends AbstractPipelineTask {

    private taskStatus: azureReleaseInterfaces.TaskStatus;
    private static readonly COMPLETE_TASK_STATUSES: azureReleaseInterfaces.TaskStatus[] = [azureReleaseInterfaces.TaskStatus.Failed, azureReleaseInterfaces.TaskStatus.Failure, azureReleaseInterfaces.TaskStatus.PartiallySucceeded, azureReleaseInterfaces.TaskStatus.Succeeded, azureReleaseInterfaces.TaskStatus.Success]
    private static readonly FAILED_TASK_STATUSES: azureReleaseInterfaces.TaskStatus[] = [azureReleaseInterfaces.TaskStatus.Failed, azureReleaseInterfaces.TaskStatus.Failure]


    constructor(taskReference: ITaskReference, name: string, startTime: Date, finishTime: Date, status: azureReleaseInterfaces.TaskStatus) {
        super(taskReference, name, startTime, finishTime);
        this.taskStatus = status;
    }
   
    protected hasCompleteStatus(): boolean {
        return this.currentStatusIsIncluded(ReleaseTask.COMPLETE_TASK_STATUSES);
    }

    public wasFailure(): boolean {
        return this.currentStatusIsIncluded(ReleaseTask.FAILED_TASK_STATUSES);
    }

    private currentStatusIsIncluded(statusesToCheck: azureReleaseInterfaces.TaskStatus[]) {
        return statusesToCheck.includes(this.taskStatus);
    }

}
