import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ITaskReference } from "./ITaskReference";

export class BuildTaskRun extends AbstractPipelineTaskRun {
  private state: azureBuildInterfaces.TimelineRecordState;
  private result: azureBuildInterfaces.TaskResult;

  constructor(
    taskRunReference: ITaskReference,
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
