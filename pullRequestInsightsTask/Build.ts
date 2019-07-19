import { AbstractPipeline } from "./AbstractPipeline";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import { BuildTaskRun } from "./BuildTaskRun";
import { AbstractAzureApi } from "./dataProviders/AbstractAzureApi";

export class Build extends AbstractPipeline {
  private buildData: azureBuildInterfaces.Build;

  constructor(
    buildData: azureBuildInterfaces.Build,
    timelineData: azureBuildInterfaces.Timeline
  ) {
    super();
    this.buildData = buildData;
    let tasks: AbstractPipelineTaskRun[] = [];
    if (timelineData) {
      for (let taskRecord of timelineData.records) {
        tasks.push(
          new BuildTaskRun(
            taskRecord.task,
            taskRecord.name,
            taskRecord.startTime,
            taskRecord.finishTime,
            taskRecord.workerName,
            taskRecord.state,
            taskRecord.result
          )
        );
      }
    }
    this.addTaskRuns(tasks);
  }

  public isFailure(): boolean {
    if (this.isComplete()) {
      return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
    }
    return this.taskFailedDuringRun();
  }

  public isComplete(): boolean {
    return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
  }

  public getDefinitionId(): number {
    return Number(this.buildData.definition.id);
  }

  public getDefinitionName(): string {
    return this.buildData.definition.name;
  }

  public async getDefinitionLink(
    apiCaller: AbstractAzureApi,
    project: string
  ): Promise<string> {
    return (await apiCaller.getDefinition(project, this.getDefinitionId()))
      ._links.web.href;
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
}
