import { ReleaseEnvironment } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { LinkHelper } from "../helpers/LinkHelper";
import { ReleaseEnvironmentViewModel } from "./ReleaseEnvironmentViewModel";

export class ReleaseViewModel {
  public CurrentEnvironment: ReleaseEnvironmentViewModel;
  public ReleaseDefinitionName: string;
  public ReleaseDefinitionUrl: string;
  public ReleaseId: number;
  public ReleaseName: string;
  public ReleaseSummaryUrl: string;
  public ReleaseLogsLink: string;

  constructor(currentEnvironment: ReleaseEnvironment, releaseConfig: PipelineConfiguration) {
    if (currentEnvironment != null) {
      this.CurrentEnvironment = new ReleaseEnvironmentViewModel(currentEnvironment);
      this.ReleaseDefinitionName = currentEnvironment.releaseDefinition == null ? null : currentEnvironment.releaseDefinition.name;

      if (currentEnvironment.releaseDefinition != null) {
        this.ReleaseDefinitionUrl = LinkHelper.getReleaseDefinitionLink(releaseConfig,
          currentEnvironment.releaseDefinition.id);
      }

      this.ReleaseName = currentEnvironment.release == null ? null : currentEnvironment.release.name;
    }

    this.ReleaseId = releaseConfig.$pipelineId;
    this.ReleaseSummaryUrl = LinkHelper.getReleaseSummaryLink(releaseConfig.$pipelineId, releaseConfig);
    this.ReleaseLogsLink = LinkHelper.getReleaseLogsTabLink(releaseConfig);
  }
}