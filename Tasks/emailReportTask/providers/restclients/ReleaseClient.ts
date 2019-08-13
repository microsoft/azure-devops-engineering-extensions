import { Release, Change, EnvironmentStatus, ReleaseStatus, ReleaseExpands, ReleaseQueryOrder } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require("azure-pipelines-task-lib/task");
import { AbstractClient } from "./AbstractClient";
import { release } from "os";
import { IPipelineRestClient } from "./IPipelineRestClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ChangeModel } from "../../model/ChangeModel";

export class ReleaseRestClient extends AbstractClient implements IPipelineRestClient {

  constructor(pipelineConfig: PipelineConfiguration) {
    super(pipelineConfig);
  }

  public async getPipelineAsync(): Promise<Release> {
    return (await this.connection.getReleaseApi()).getRelease(
      this.pipelineConfig.$projectId,
      this.pipelineConfig.$pipelineId
    );
  }

  public async getLastPipelineAsync(
    pipelineDefId: number,
    envDefId: number,
    sourceBranchFilter: string
  ): Promise<Release> {
    let lastRelease: Release = null;
    const releaseStatusFilter = ReleaseStatus.Active;
    const envStatusFilter = EnvironmentStatus.Succeeded | EnvironmentStatus.PartiallySucceeded | EnvironmentStatus.Rejected | EnvironmentStatus.Canceled;
    const releases = await (await this.connection.getReleaseApi()).getReleases(
      this.pipelineConfig.$projectId,
      pipelineDefId,
      envDefId,
      null,
      null,
      releaseStatusFilter,
      envStatusFilter,
      null,
      null,
      ReleaseQueryOrder.Descending,
      1,
      null,
      ReleaseExpands.Environments,
      null,
      null,
      null,
      sourceBranchFilter
    );

    if (releases != null && release.length < 1) {
      console.log(`Unable to fetch last completed release for release definition:${pipelineDefId} and environmentid: ${envDefId}`);
    }
    else {
      lastRelease = releases[0];
    }

    return lastRelease;
  }

  public async getPipelineChangesAsync(prevPipelineId: number): Promise<ChangeModel[]> {

    console.log(`Fetching changes between releases - ${prevPipelineId} & ${this.pipelineConfig.$pipelineId}`);
    const changes = await (await this.connection.getReleaseApi()).getReleaseChanges(
      this.pipelineConfig.$projectId,
      this.pipelineConfig.$pipelineId,
      prevPipelineId);

    if (changes == null || changes.length < 1) {
      console.log(`No changes found between releases - ${prevPipelineId} & ${this.pipelineConfig.$pipelineId}`);
      return [];
    }

    return changes.map(item => new ChangeModel(item.id, item.author, item.location, item.timestamp, item.message));
  }

  getPipelineTimelineAsync(pipelineId: number): Promise<import("azure-devops-node-api/interfaces/BuildInterfaces").Timeline> {
    throw new Error("Method not supported.");
  }
}