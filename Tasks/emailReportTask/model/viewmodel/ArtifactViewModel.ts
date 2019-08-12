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
    this.BuildSummaryUrl = LinkHelper.getBuildSummaryLinkByArtifact(artifact, config);
    this.ArtifactDefinitionUrl = LinkHelper.getBuildDefinitionLinkByArtifact(artifact, config);
  }

  private getArtifactInfo(artifact: Artifact, key: string): string {
    const sourceRef = artifact.definitionReference[key];
    return isNullOrUndefined(sourceRef) ? null : sourceRef.name;
  }
}