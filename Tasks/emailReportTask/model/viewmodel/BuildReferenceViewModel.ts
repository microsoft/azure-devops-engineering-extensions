import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { BuildReference, Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { LinkHelper } from "../helpers/LinkHelper";
import { isNullOrUndefined } from "util";

export class BuildReferenceViewModel {
  public Id: string;
  public Number: string;
  public Branch: string;
  public Url: string;
  public DefinitionUrl: string;
  public DefinitionName: string;

  constructor(config: PipelineConfiguration, buildReference: BuildReference, build: Build)  {
    if(buildReference != null) {
      this.Id = buildReference.id.toString();
      this.Number = buildReference.buildNumber;
      if(!isNullOrUndefined(buildReference._links) && !isNullOrUndefined(buildReference._links.web) && !isNullOrUndefined(buildReference._links.web.href)) {
        this.Url = buildReference._links.web.href;
      }
    } else if (build != null) {
      this.Id = build.id.toString();
      this.Number = build.buildNumber;
      this.Branch = build.sourceBranch;
      if(!isNullOrUndefined(build._links) && !isNullOrUndefined(build._links.web) && !isNullOrUndefined(build._links.web.href)) {
        this.Url = build._links.web.href;
      }
      this.DefinitionUrl = LinkHelper.getBuildDefinitionLinkById(build.definition.id, config);
      this.DefinitionName = build.definition.name;
    }
  }
}