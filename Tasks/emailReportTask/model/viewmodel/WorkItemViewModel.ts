import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { LinkHelper } from "../helpers/LinkHelper";
import { StringUtils } from "../../utils/StringUtils";

export class WorkItemViewModelWrapper {
  public WorkItemViewModel: WorkItemViewModel[];
}

export class WorkItemViewModel {
  public AssignedTo: string;
  public ChangedDate: string;
  public Id: number;
  public State: string;
  public Title: string;
  public Url: string;

  constructor(config: PipelineConfiguration, workItem: WorkItem) {
      if (workItem.id != null)
      {
        this.Id = workItem.id;
        this.Url = LinkHelper.getWorkItemLink(config, workItem.id);
      }

    this.Title = workItem.fields["System.Title"];

    // This is for display in email report only
    var assignToRef = workItem.fields["System.AssignedTo"];
    // Prefer Display name to Unique Name in report
    this.AssignedTo = assignToRef == null ? "" : 
      (StringUtils.isNullOrWhiteSpace(assignToRef.DisplayName) ? assignToRef.UniqueName : assignToRef.DisplayName);

    this.State = workItem.fields["System.State"];
    this.ChangedDate = workItem.fields["System.ChangedDate"];
  }
}