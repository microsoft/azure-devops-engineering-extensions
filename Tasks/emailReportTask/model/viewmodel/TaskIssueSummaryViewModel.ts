import { TaskIssueViewModel, TaskIssueViewModelWrapper } from "./TaskIssueViewModel";
import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { StringUtils } from "../../utils/StringUtils";
import { TaskModel } from "../TaskModel";

export class TaskIssueSummaryViewModel {
  public Issues: TaskIssueViewModelWrapper;
  public ErrorMessage: string;
  public ErrorCount: number;
  public WarningCount: number;

  constructor(tasks: TaskModel[]) {
    var allIssues: TaskIssueViewModel[] = [];
    this.ErrorMessage = `Failed on ${tasks.filter(t => t.$status == TaskStatus.Failed || t.$status == TaskStatus.Canceled).length}/${tasks.length} Agents`;
    tasks.forEach(task => {
      if (task.$issues != null && task.$issues.length > 0) {
        task.$issues.forEach(issue => {
          if (!StringUtils.isNullOrWhiteSpace(issue.$message)) {
            if (issue.$issueType.toLowerCase() == IssueTypeConstants.Error) {
              this.ErrorCount++;
            }
            else if (issue.$issueType.toLowerCase() == IssueTypeConstants.Warning) {
              this.WarningCount++;
            }

            allIssues.push(new TaskIssueViewModel(issue.$message, issue.$issueType, task.$agentName));
          }
        });
      }
    });
    this.Issues = new TaskIssueViewModelWrapper();
    this.Issues.TaskIssueViewModel = this.TruncateIssues(allIssues);
  }

  public TruncateIssues(issues: TaskIssueViewModel[], characterLimit: number = 1000): TaskIssueViewModel[] {
    const truncatedIssues: TaskIssueViewModel[] = [];
    var warningIssues = issues.filter(t => t.IssueType.toLowerCase() != IssueTypeConstants.Error);
    var errorIssues = issues.filter(t => t.IssueType.toLowerCase() == IssueTypeConstants.Error);

    const sortedIssues: TaskIssueViewModel[] = [];
    sortedIssues.push(...warningIssues);
    sortedIssues.push(...errorIssues);

    let currentCharCount = 0;
    for (var i = 0; i < sortedIssues.length; i++) {
      const issue = sortedIssues[i];
      if (currentCharCount >= characterLimit) {
        return truncatedIssues;
      }

      issue.Message = issue.Message.substring(0, characterLimit - currentCharCount);
      currentCharCount += issue.Message.length;
      truncatedIssues.push(issue);
    }

    return truncatedIssues;
  }
}

export class IssueTypeConstants {
  public static readonly Error = "error";
  public static readonly Warning = "warning";
}