"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseIssuesViewModel = void 0;
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const TaskResultViewModel_1 = require("./TaskResultViewModel");
const TaskModel_1 = require("../TaskModel");
class PhaseIssuesViewModel {
    constructor(phases) {
        /// <summary>
        /// Use TaskResultViewModel as Phase level issue as the viewmodel is same
        /// </summary>
        this.Tasks = new TaskResultViewModel_1.TaskResultViewModelWrapper();
        this.Name = "Phase Issues";
        this.Tasks.TaskResultViewModel = [];
        phases.forEach(phase => {
            if (phase != null && phase.$jobs != null) {
                const canceledJobs = phase.$jobs.filter(job => job.$jobStatus == ReleaseInterfaces_1.TaskStatus.Canceled);
                if (canceledJobs.length > 0) {
                    var failedJobsAsTasks = canceledJobs.map(job => {
                        return new TaskModel_1.TaskModel(job.$jobName, job.$jobStatus, job.$issues, null, null, null);
                    });
                    var taskResViewModel = new TaskResultViewModel_1.TaskResultViewModel(failedJobsAsTasks);
                    taskResViewModel.IssuesSummary.ErrorMessage = `Failed on ${canceledJobs.length}/${phase.$jobs.length} Agents`;
                    this.Tasks.TaskResultViewModel.push(taskResViewModel);
                }
            }
        });
    }
}
exports.PhaseIssuesViewModel = PhaseIssuesViewModel;
//# sourceMappingURL=PhaseIssuesViewModel.js.map