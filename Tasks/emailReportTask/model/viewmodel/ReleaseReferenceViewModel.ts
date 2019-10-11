import { LinkHelper } from "../helpers/LinkHelper";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ReleaseReference } from "azure-devops-node-api/interfaces/ReleaseInterfaces";

export class ReleaseReferenceViewModel {
  public Id: number;
  public Name: string;
  public Url: string;

  constructor(config: PipelineConfiguration, releaseReference: ReleaseReference) {
    this.Id = releaseReference.id;
    this.Name = releaseReference.name;
    this.Url = LinkHelper.getReleaseSummaryLink(config);
  }
}