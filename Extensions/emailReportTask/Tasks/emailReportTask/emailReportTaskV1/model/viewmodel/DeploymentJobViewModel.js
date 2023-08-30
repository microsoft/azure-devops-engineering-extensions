"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentJobViewModel = void 0;
const TaskResultViewModel_1 = require("./TaskResultViewModel");
class DeploymentJobViewModel {
    constructor(jobs) {
        this.Tasks = new TaskResultViewModel_1.TaskResultViewModelWrapper();
        this.Tasks.TaskResultViewModel = [];
        if (jobs.length > 0) {
            let taskIndex = 0;
            let releaseTasks = [];
            do {
                releaseTasks = [];
                jobs.forEach(job => {
                    // Not all jobs have same set of tasks
                    if (taskIndex < job.$tasks.length) {
                        releaseTasks.push(job.$tasks[taskIndex]);
                        this.MinTaskStartTime = this.getMinTime(this.MinTaskStartTime, job.$tasks[taskIndex].$startTime);
                        this.MaxTaskFinishTime = this.getMaxTime(this.MaxTaskFinishTime, job.$tasks[taskIndex].$finishTime);
                    }
                });
                if (releaseTasks != null && releaseTasks.length > 0) {
                    this.Tasks.TaskResultViewModel.push(new TaskResultViewModel_1.TaskResultViewModel(releaseTasks));
                }
                taskIndex++;
            } while (releaseTasks.length > 0);
        }
    }
    getMinTime(time1, time2) {
        if (time1 == null) {
            return time2;
        }
        else if (time2 != null && time2 < time1) {
            return time2;
        }
        return time1;
    }
    getMaxTime(time1, time2) {
        if (time1 == null) {
            return time2;
        }
        else if (time2 != null && time2 > time1) {
            return time2;
        }
        return time1;
    }
}
exports.DeploymentJobViewModel = DeploymentJobViewModel;
//# sourceMappingURL=DeploymentJobViewModel.js.map