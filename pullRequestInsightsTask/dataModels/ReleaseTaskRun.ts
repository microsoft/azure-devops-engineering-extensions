import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require("azure-pipelines-task-lib/task");
import { ITaskReference } from "./ITaskReference";

export class ReleaseTaskRun extends AbstractPipelineTaskRun {
  private taskStatus: azureReleaseInterfaces.TaskStatus;
  private static readonly COMPLETE_TASK_STATUSES: azureReleaseInterfaces.TaskStatus[] = [
    azureReleaseInterfaces.TaskStatus.Failed,
    azureReleaseInterfaces.TaskStatus.Failure,
    azureReleaseInterfaces.TaskStatus.PartiallySucceeded,
    azureReleaseInterfaces.TaskStatus.Succeeded,
    azureReleaseInterfaces.TaskStatus.Success
  ];
  private static readonly FAILED_TASK_STATUSES: azureReleaseInterfaces.TaskStatus[] = [
    azureReleaseInterfaces.TaskStatus.Failed,
    azureReleaseInterfaces.TaskStatus.Failure
  ];

  constructor(
    taskRunReference: ITaskReference,
    name: string,
    startTime: Date,
    finishTime: Date,
    agentName: string,
    status: azureReleaseInterfaces.TaskStatus
  ) {
    super(taskRunReference, name, startTime, finishTime, agentName);
    this.taskStatus = status;
  }

  public wasFailure(): boolean {
    return this.currentStatusIsIncluded(ReleaseTaskRun.FAILED_TASK_STATUSES);
  }

  protected hasCompleteStatus(): boolean {
    return this.currentStatusIsIncluded(ReleaseTaskRun.COMPLETE_TASK_STATUSES);
  }

  private currentStatusIsIncluded(
    statusesToCheck: azureReleaseInterfaces.TaskStatus[]
  ): boolean {
    return statusesToCheck.includes(this.taskStatus);
  }
}
