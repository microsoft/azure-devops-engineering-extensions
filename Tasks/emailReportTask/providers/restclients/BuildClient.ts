import { IPipelineRestClient } from "./IPipelineRestClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Build, BuildResult, BuildQueryOrder, Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ChangeModel } from "../../model/ChangeModel";
import { AbstractClient } from "./AbstractClient";
import { IBuildApi } from "azure-devops-node-api/BuildApi";

export class BuildRestClient extends AbstractClient implements IPipelineRestClient {

  private buildApi: Promise<IBuildApi>;

  constructor(pipelineConfig: PipelineConfiguration) {
    super(pipelineConfig);
    this.buildApi = this.connection.getBuildApi();
  }

  public async getPipelineAsync(): Promise<Build> {
    return await (await this.buildApi).getBuild(this.pipelineConfig.$projectId, this.pipelineConfig.$pipelineId);
  }

  public async getLastPipelineAsync(pipelineDefId: number, envDefId: number, sourceBranchFilter: string, maxCreatedDate?: Date): Promise<Build> {
    const builds = await (await this.buildApi).getBuilds(
      this.pipelineConfig.$projectId,
      [pipelineDefId],
      null,
      null,
      null,
      maxCreatedDate,
      null,
      null,
      null,
      BuildResult.Succeeded | BuildResult.PartiallySucceeded | BuildResult.Failed | BuildResult.Canceled,
      null,
      null,
      1,
      null,
      null,
      null,
      BuildQueryOrder.FinishTimeDescending,
      sourceBranchFilter);
    if (builds != null && builds.length > 0) {
      return builds[0];
    }
    console.log(`Unable to find any build for definition id - ${pipelineDefId}`);
    return null;
  }

  public async getPipelineChangesAsync(prevPipelineId: number): Promise<ChangeModel[]> {
    const changes = await (await this.buildApi).getBuildChanges(this.pipelineConfig.$projectId, this.pipelineConfig.$pipelineId);
    if (changes == null || changes.length < 1) {
      console.log(`No changes found for pipelineId - ${this.pipelineConfig.$pipelineId}`);
      return [];
    }
    return changes.map(item => new ChangeModel(item.id, item.author, item.location, item.timestamp, item.message));
  }

  public async getPipelineTimelineAsync(pipelineId: number): Promise<Timeline> {
    return await (await this.buildApi).getBuildTimeline(this.pipelineConfig.$projectId, pipelineId);
  }
}