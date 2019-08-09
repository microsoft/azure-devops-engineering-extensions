import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ITaskRunReference } from "./ITaskRunReference";

/**
 * This class represents a single run of an AzureDevOps build task
 */
export class BuildTaskRun extends AbstractPipelineTaskRun {
  private state: azureBuildInterfaces.TimelineRecordState;
  private result: azureBuildInterfaces.TaskResult;

  constructor(
    taskRunReference: ITaskRunReference,
    name: string,
    startTime: Date,
    finishTime: Date,
    agentName: string,
    state: azureBuildInterfaces.TimelineRecordState,
    result: azureBuildInterfaces.TaskResult
  ) {
    super(taskRunReference, name, startTime, finishTime, agentName);
    this.state = state;
    this.result = result;
  }

  protected hasCompleteStatus(): boolean {
    return this.state === azureBuildInterfaces.TimelineRecordState.Completed;
  }

  public wasFailure(): boolean {
    return this.result === azureBuildInterfaces.TaskResult.Failed;
  }
}
