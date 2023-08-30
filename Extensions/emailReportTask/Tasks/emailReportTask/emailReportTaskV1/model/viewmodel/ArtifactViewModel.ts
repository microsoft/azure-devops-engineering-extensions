import { Artifact } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { LinkHelper } from "../helpers/LinkHelper";
import { isNullOrUndefined } from "util";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";

export class ArtifactViewModelWrapper {
  public ArtifactViewModel: ArtifactViewModel[];
}

export class ArtifactViewModel {
  public ArtifactDefinitionUrl: string;
  public BranchName: string;
  public BuildSummaryUrl: string;
  public Name: string;
  public Version: string;
  public IsPrimary: boolean;

  constructor(artifact: Artifact, config: PipelineConfiguration) {
    this.Version = this.getArtifactInfo(artifact, "version");
    this.BranchName = this.getArtifactInfo(artifact, "branch");
    this.Name = artifact.alias;
    this.IsPrimary = artifact.isPrimary;

    if (!isNullOrUndefined(artifact.definitionReference)) {
      if (!isNullOrUndefined(artifact.definitionReference.artifactSourceDefinitionUrl) &&
        !isNullOrUndefined(artifact.definitionReference.artifactSourceDefinitionUrl.id)) {
        this.ArtifactDefinitionUrl = artifact.definitionReference.artifactSourceDefinitionUrl.id;
      }

      if (!isNullOrUndefined(artifact.definitionReference.artifactSourceVersionUrl) &&
        !isNullOrUndefined(artifact.definitionReference.artifactSourceVersionUrl.id)) {
        this.BuildSummaryUrl = artifact.definitionReference.artifactSourceVersionUrl.id;
      }
    }
  }

  private getArtifactInfo(artifact: Artifact, key: string): string {
    const sourceRef = artifact.definitionReference[key];
    return isNullOrUndefined(sourceRef) ? null : sourceRef.name;
  }
}