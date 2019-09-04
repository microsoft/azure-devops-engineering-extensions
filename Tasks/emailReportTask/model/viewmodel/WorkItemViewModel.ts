import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { LinkHelper } from "../helpers/LinkHelper";
import { StringUtils } from "../../utils/StringUtils";
import { isNullOrUndefined } from "util";

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
    if (workItem.id != null) {
      this.Id = workItem.id;
      this.Url = LinkHelper.getWorkItemLink(config, workItem.id);
    }

    this.Title = workItem.fields["System.Title"];

    // This is for display in email report only
    var assignToRef = workItem.fields["System.AssignedTo"];
    // Prefer Display name to Unique Name in report
    this.AssignedTo = isNullOrUndefined(assignToRef) ? "" : (StringUtils.isNullOrWhiteSpace(assignToRef.displayName) ? assignToRef.uniqueName : assignToRef.displayName);
    // Unassigned workitem
    this.AssignedTo = isNullOrUndefined(this.AssignedTo) ? "" : this.AssignedTo;

    this.State = workItem.fields["System.State"];
    this.ChangedDate = workItem.fields["System.ChangedDate"];
  }
}