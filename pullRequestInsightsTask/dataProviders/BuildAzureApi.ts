import { AbstractAzureApi } from "./AbstractAzureApi";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../dataModels/Build";
import { PipelineData } from "../config/PipelineData";
import tl = require("azure-pipelines-task-lib/task");
import { AbstractPipeline } from "../dataModels/AbstractPipeline";

export class BuildAzureApi extends AbstractAzureApi {
  static readonly DESIRED_BUILD_STATUS: number =
    azureBuildInterfaces.BuildStatus.Completed;

  constructor(uri: string, accessKey: string) {
    super(uri, accessKey);
  }

  public async getCurrentPipeline(
    data: PipelineData
  ): Promise<AbstractPipeline> {
    return await this.getBuild(data.getProjectName(), data.getBuildId());
  }

  public async getMostRecentPipelinesOfCurrentType(
    project: string,
    currentPipeline: AbstractPipeline,
    maxNumber: number,
    branchName: string
  ): Promise<AbstractPipeline[]> {
    return this.getBuilds(
      project,
      currentPipeline.getDefinitionId(),
      BuildAzureApi.DESIRED_BUILD_STATUS,
      maxNumber,
      branchName
    );
  }

  public async getBuild(
    project: string,
    buildId: number
  ): Promise<AbstractPipeline> {
    return new Build(
      await this.getBuildData(project, buildId),
      await this.getBuildTimeline(project, buildId)
    );
  }

  public async getDefinition(
    project: string,
    definitionId: number
  ): Promise<azureBuildInterfaces.BuildDefinition> {
    return (await this.getConnection().getBuildApi()).getDefinition(
      project,
      definitionId
    );
  }

  public async getBuilds(
    project: string,
    definition?: number,
    status?: number,
    maxNumber?: number,
    branchName?: string
  ): Promise<AbstractPipeline[]> {
    tl.debug(
      `getting builds with: ${project}, ${definition}, ${status}, ${maxNumber}, ${branchName}`
    );
    let builds: Array<AbstractPipeline> = [];
    let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.getConnection().getBuildApi()).getBuilds(
      project,
      [definition],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      status,
      undefined,
      undefined,
      undefined,
      maxNumber,
      undefined,
      undefined,
      undefined,
      undefined,
      branchName
    );
    let timelinePromiseData: Promise<azureBuildInterfaces.Timeline>[] = [];
    for (let buildData of rawBuildsData) {
      timelinePromiseData.push(this.getBuildTimeline(project, buildData.id));
    }
    await Promise.all(timelinePromiseData);
    for (let index = 0; index < rawBuildsData.length; index++) {
      if (timelinePromiseData[index] !== null) {
        builds.push(
          new Build(rawBuildsData[index], await timelinePromiseData[index])
        );
      }
    }
    return builds;
  }

  private async getBuildData(
    project: string,
    buildId: number
  ): Promise<azureBuildInterfaces.Build> {
    return (await this.getConnection().getBuildApi()).getBuild(
      project,
      buildId
    );
  }
  private async getBuildTimeline(
    project: string,
    buildId: number
  ): Promise<azureBuildInterfaces.Timeline> {
    return (await this.getConnection().getBuildApi()).getBuildTimeline(
      project,
      buildId
    );
  }
}
