import { ChangeModel } from "../ChangeModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { StringUtils } from "../../utils/StringUtils";
import { LinkHelper } from "../helpers/LinkHelper";

export class ChangeViewModelWrapper {
  public ChangeViewModel: ChangeViewModel[];
}

export class ChangeViewModel {
  public readonly ConstHashLength = 8;
  public AuthorName: string;
  public Id: string;
  public Message: string;
  public TimeStamp: string;
  public Url: string;
  public ShortId: string;

  constructor(change: ChangeModel, config: PipelineConfiguration) {
    this.Id = change.$id;
    this.ShortId = isNaN(Number.parseInt(this.Id)) ? this.Id : this.Id.substring(0, this.ConstHashLength);
    this.Message = StringUtils.CompressNewLines(change.$message);
    this.AuthorName = change.$author == null ? null : change.$author.displayName;
    this.TimeStamp = change.$timeStamp.toDateString();

    this.Url = LinkHelper.getCommitLink(change.$id, change.$location, config);
  }
}