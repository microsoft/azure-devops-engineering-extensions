"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseViewModel = exports.PhaseViewModelWrapper = void 0;
const DeploymentJobViewModel_1 = require("./DeploymentJobViewModel");
const TimeFormatter_1 = require("../helpers/TimeFormatter");
class PhaseViewModelWrapper {
}
exports.PhaseViewModelWrapper = PhaseViewModelWrapper;
class PhaseViewModel {
    constructor(phase) {
        this.Status = phase.$status;
        this.Rank = phase.$rank;
        this.Name = phase.$name;
        this.InitializeDeploymentJobs(phase);
    }
    InitializeDeploymentJobs(phase) {
        const deploymentJobs = phase.$jobs;
        if (deploymentJobs.length > 0) {
            this.DeploymentJob = new DeploymentJobViewModel_1.DeploymentJobViewModel(deploymentJobs);
            this.InitializeTasksDuration();
        }
        else {
            // This can happen if we have an empty phase or a phase with only disabled steps
            console.warn(`No deployment jobs found in phase ${this.Name}`);
        }
    }
    InitializeTasksDuration() {
        // Evaluate job duration and format it
        if (this.DeploymentJob.MaxTaskFinishTime != null && this.DeploymentJob.MinTaskStartTime != null) {
            this.TasksDuration = `${TimeFormatter_1.TimeFormatter.FormatDuration(this.DeploymentJob.MaxTaskFinishTime.getTime() - this.DeploymentJob.MinTaskStartTime.getTime())}`;
        }
    }
}
exports.PhaseViewModel = PhaseViewModel;
//# sourceMappingURL=PhaseViewModel.js.map