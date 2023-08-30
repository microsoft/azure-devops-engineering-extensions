"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
class JobModel {
    constructor($jobName, $jobStatus, $issues, $tasks) {
        this.tasks = $tasks;
        this.jobStatus = $jobStatus;
        this.issues = $issues;
        this.jobName = $jobName;
    }
    /**
   * Getter $jobName
   * @return {string}
   */
    get $jobName() {
        return this.jobName;
    }
    /**
   * Getter $issues
   * @return {IssueModel[]}
   */
    get $issues() {
        return this.issues;
    }
    /**
     * Getter $tasks
     * @return {TaskModel[]}
     */
    get $tasks() {
        return this.tasks;
    }
    /**
     * Getter $jobStatus
     * @return {TaskStatus}
     */
    get $jobStatus() {
        return this.jobStatus;
    }
}
exports.JobModel = JobModel;
//# sourceMappingURL=JobModel.js.map