import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { BuildReference, Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { LinkHelper } from "../helpers/LinkHelper";
import { PipelineViewModel } from "./PipelineViewModel";

export class BuildReferenceViewModel extends PipelineViewModel {
  public Id: string;
  public Number: string;
  public Branch: string;
  public Url: string;
  public DefinitionUrl: string;
  public DefinitionName: string;

  constructor(config: PipelineConfiguration, buildReference: BuildReference, build: Build)  {
    super();
    if(buildReference != null) {
      this.Id = buildReference.id.toString();
      this.Number = buildReference.buildNumber;
      this.Url = LinkHelper.getBuildSummaryLinkById(buildReference.id, config);
    } else if (build != null) {
      this.Id = build.id.toString();
      this.Number = build.buildNumber;
      this.Branch = build.sourceBranch;
      this.Url = LinkHelper.getBuildSummaryLinkById(build.id, config);
      this.DefinitionUrl = LinkHelper.getBuildDefinitionLinkById(build.definition.id, config);
      this.DefinitionName = build.definition.name;
    }
  }
}