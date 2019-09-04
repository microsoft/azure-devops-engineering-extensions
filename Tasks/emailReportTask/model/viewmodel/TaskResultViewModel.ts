import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { TaskIssueSummaryViewModel } from "./TaskIssueSummaryViewModel";
import { TaskModel } from "../TaskModel";
import { TimeFormatter } from "../helpers/TimeFormatter";

export class TaskResultViewModelWrapper {
  public TaskResultViewModel: TaskResultViewModel[]
}

export class TaskResultViewModel {

  public Duration: string;
  public HasFailed: boolean;
  public HasSkipped: boolean;
  public NotYetRun: boolean; // tasks ahead of current email task
  public HasPartiallySucceeded: boolean; 
  public HasNotRunOnSomeAgents: boolean;
  public GotCancelled: boolean;
  public NotRunMessage: string;
  public IssuesSummary: TaskIssueSummaryViewModel;
  public Name: string;
  public StartTime: string;
  public Status: string;

  constructor(tasks: TaskModel[]) {
    this.Name = tasks.length > 0 ? tasks[0].$name : "";

    this.HasFailed = tasks.filter(t => t.$status == TaskStatus.Failed || t.$status == TaskStatus.Canceled).length > 0;
    this.HasSkipped = tasks.filter(t => t.$status == TaskStatus.Skipped).length == tasks.length;
    this.NotYetRun = tasks.filter(t => t.$status == TaskStatus.InProgress || t.$status == TaskStatus.Unknown || t.$status == TaskStatus.Pending).length > 0;
    this.HasPartiallySucceeded = tasks.filter(t => t.$status == TaskStatus.PartiallySucceeded).length > 0;
    this.GotCancelled = tasks.filter(t => t.$status == TaskStatus.Canceled).length > 0;

    const inProgressTasks = tasks.filter(t => t.$status == TaskStatus.InProgress);
    if(inProgressTasks.length == 1) {
      // Must be this task - Mark it as completed assuming we will pass
      // If we don't, then the email report won't be sent with this data
      this.NotYetRun = false;
    }

    if (tasks.length > 1) {
      this.HasNotRunOnSomeAgents = tasks.filter(t => t.$status == TaskStatus.Skipped).length > 0;
      this.NotRunMessage = `Not run on ${tasks.filter(t => t.$status == TaskStatus.Skipped).length}/${tasks.length} agents`;
    }

    this.IssuesSummary = new TaskIssueSummaryViewModel(tasks);

    // No point in calculating duration for skipped/cancelled/not-yet-run tasks
    if (!this.HasSkipped && !this.NotYetRun && !this.GotCancelled) {
      this.InitializeDuration(tasks.filter(t => t.$status != TaskStatus.Skipped));
    } else {
      this.Duration = "";
    }
  }

  private InitializeDuration(tasks: TaskModel[]): void {
    if (tasks.length == 1) {
      var firstTask = tasks[0];
      if (firstTask.$finishTime != null && firstTask.$startTime != null) {
        this.Duration = TimeFormatter.FormatDuration(this.getTimeDiff(firstTask));
      }
    }
    else {
      const nonNullTasks = tasks.filter(t => t.$finishTime != null && t.$startTime != null);
      if (nonNullTasks.length > 0) {
        var minTime = this.getMinTime(nonNullTasks);
        var maxTime = this.getMaxTime(nonNullTasks);

        if (minTime != null && maxTime != null) {
          const minTimeStr = TimeFormatter.FormatDuration(minTime);
          const maxTimeStr = TimeFormatter.FormatDuration(maxTime);
          this.Duration = minTimeStr == maxTimeStr ? minTimeStr : `${minTimeStr} - ${maxTimeStr}`;
        }
      }
    }
  }

  private getMinTime(tasks: TaskModel[]): number {
    let minTime = this.getTimeDiff(tasks[0]);
    for (var i = 1; i < tasks.length; i++) {
      const diffTime = this.getTimeDiff(tasks[i]);
      if (diffTime < minTime) {
        minTime = diffTime;
      }
    }
    return minTime;
  }

  private getMaxTime(tasks: TaskModel[]): number {
    let maxTime = this.getTimeDiff(tasks[0]);
    for (var i = 1; i < tasks.length; i++) {
      const diffTime = this.getTimeDiff(tasks[i]);
      if (diffTime > maxTime) {
        maxTime = diffTime;
      }
    }
    return maxTime;
  }

  private getTimeDiff(task: TaskModel): number {
    return task.$finishTime.getTime() - task.$startTime.getTime();
  }
}