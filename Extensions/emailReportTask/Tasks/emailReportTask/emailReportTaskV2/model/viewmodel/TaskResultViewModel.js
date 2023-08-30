"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskResultViewModel = exports.TaskResultViewModelWrapper = void 0;
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const TaskIssueSummaryViewModel_1 = require("./TaskIssueSummaryViewModel");
const TimeFormatter_1 = require("../helpers/TimeFormatter");
class TaskResultViewModelWrapper {
}
exports.TaskResultViewModelWrapper = TaskResultViewModelWrapper;
class TaskResultViewModel {
    constructor(tasks) {
        this.Name = tasks.length > 0 ? tasks[0].$name : "";
        this.HasFailed = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.Failed || t.$status == ReleaseInterfaces_1.TaskStatus.Canceled).length > 0;
        this.HasSkipped = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.Skipped).length == tasks.length;
        this.NotYetRun = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.InProgress || t.$status == ReleaseInterfaces_1.TaskStatus.Unknown || t.$status == ReleaseInterfaces_1.TaskStatus.Pending).length > 0;
        this.HasPartiallySucceeded = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.PartiallySucceeded).length > 0;
        this.GotCancelled = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.Canceled).length > 0;
        const inProgressTasks = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.InProgress);
        if (inProgressTasks.length == 1) {
            // Must be this task - Mark it as completed assuming we will pass
            // If we don't, then the email report won't be sent with this data
            this.NotYetRun = false;
        }
        if (tasks.length > 1) {
            this.HasNotRunOnSomeAgents = tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.Skipped).length > 0;
            this.NotRunMessage = `Not run on ${tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.Skipped).length}/${tasks.length} agents`;
        }
        this.IssuesSummary = new TaskIssueSummaryViewModel_1.TaskIssueSummaryViewModel(tasks);
        // No point in calculating duration for skipped/cancelled/not-yet-run tasks
        if (!this.HasSkipped && !this.NotYetRun && !this.GotCancelled) {
            this.InitializeDuration(tasks.filter(t => t.$status != ReleaseInterfaces_1.TaskStatus.Skipped));
        }
        else {
            this.Duration = "";
        }
    }
    InitializeDuration(tasks) {
        if (tasks.length == 1) {
            var firstTask = tasks[0];
            if (firstTask.$finishTime != null && firstTask.$startTime != null) {
                this.Duration = TimeFormatter_1.TimeFormatter.FormatDuration(this.getTimeDiff(firstTask));
            }
        }
        else {
            const nonNullTasks = tasks.filter(t => t.$finishTime != null && t.$startTime != null);
            if (nonNullTasks.length > 0) {
                var minTime = this.getMinTime(nonNullTasks);
                var maxTime = this.getMaxTime(nonNullTasks);
                if (minTime != null && maxTime != null) {
                    const minTimeStr = TimeFormatter_1.TimeFormatter.FormatDuration(minTime);
                    const maxTimeStr = TimeFormatter_1.TimeFormatter.FormatDuration(maxTime);
                    this.Duration = minTimeStr == maxTimeStr ? minTimeStr : `${minTimeStr} - ${maxTimeStr}`;
                }
            }
        }
    }
    getMinTime(tasks) {
        let minTime = this.getTimeDiff(tasks[0]);
        for (var i = 1; i < tasks.length; i++) {
            const diffTime = this.getTimeDiff(tasks[i]);
            if (diffTime < minTime) {
                minTime = diffTime;
            }
        }
        return minTime;
    }
    getMaxTime(tasks) {
        let maxTime = this.getTimeDiff(tasks[0]);
        for (var i = 1; i < tasks.length; i++) {
            const diffTime = this.getTimeDiff(tasks[i]);
            if (diffTime > maxTime) {
                maxTime = diffTime;
            }
        }
        return maxTime;
    }
    getTimeDiff(task) {
        return task.$finishTime.getTime() - task.$startTime.getTime();
    }
}
exports.TaskResultViewModel = TaskResultViewModel;
//# sourceMappingURL=TaskResultViewModel.js.map