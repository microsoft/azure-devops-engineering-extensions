import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { AbstractAzureApi } from "../dataProviders/AbstractAzureApi";
import tl = require("azure-pipelines-task-lib/task");
import { PipelineData } from "../config/PipelineData";
import { AbstractPipeline } from "../dataModels/AbstractPipeline";
import { Release } from "../dataModels/Release";

export class ReleaseAzureApi extends AbstractAzureApi {
  public static readonly DESIRED_RELEASE_EXPANDS: number =
    azureReleaseInterfaces.ReleaseExpands.Environments +
    azureReleaseInterfaces.ReleaseExpands.Artifacts;

  constructor(uri: string, accessKey: string) {
    super(uri, accessKey);
  }

  public async getCurrentPipeline(
    data: PipelineData
  ): Promise<AbstractPipeline> {
    return this.getRelease(data.getProjectName(), data.getReleaseId());
  }

  public async getMostRecentPipelinesOfCurrentType(
    project: string,
    currentPipeline: AbstractPipeline,
    maxNumber: number,
    branchName: string
  ): Promise<AbstractPipeline[]> {
    return this.getReleases(
      project,
      currentPipeline.getDefinitionId(),
      (currentPipeline as Release).getEnvironmentDefinitionId(),
      maxNumber,
      branchName
    );
  }

  public async findPipelinesForAndBeforeMergeCommit(
    project: string,
    pipelinesToParse: AbstractPipeline[],
    mergeCommit: string
  ): Promise<AbstractPipeline[]> {
    return pipelinesToParse; // TODO
  }

  public async getRelease(
    project: string,
    releaseId: number
  ): Promise<AbstractPipeline> {
    return new Release(await this.getReleaseData(project, releaseId));
  }

  public async getReleases(
    project: string,
    definition?: number,
    environmentDefinition?: number,
    maxNumber?: number,
    branchName?: string
  ): Promise<AbstractPipeline[]> {
    tl.debug(
      `getting releases with: ${project}, ${definition}, ${environmentDefinition}, ${branchName}`
    );
    const releases: Array<AbstractPipeline> = [];
    const rawTemporaryReleasesData: azureReleaseInterfaces.Release[] = await (await this.getConnection().getReleaseApi()).getReleases(
      project,
      definition,
      environmentDefinition,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ReleaseAzureApi.DESIRED_RELEASE_EXPANDS,
      undefined,
      undefined,
      undefined,
      branchName
    );
    const rawIndividualReleaseDataPromises: Promise<
      azureReleaseInterfaces.Release
    >[] = [];
    for (const rawReleaseData of rawTemporaryReleasesData) {
      rawIndividualReleaseDataPromises.push(
        this.getReleaseData(project, new Release(rawReleaseData).getId())
      );
    }
    for (const releaseData of rawIndividualReleaseDataPromises) {
      releases.push(new Release(await releaseData));
    }
    return releases;
  }

  public async getDefinition(
    project: string,
    definitionId: number
  ): Promise<azureReleaseInterfaces.ReleaseDefinition> {
    return (await this.getConnection().getReleaseApi()).getReleaseDefinition(
      project,
      definitionId
    );
  }

  private async getReleaseData(
    project: string,
    releaseId: number
  ): Promise<azureReleaseInterfaces.Release> {
    return (await this.getConnection().getReleaseApi()).getRelease(
      project,
      releaseId
    );
  }
}
