"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
class TaskModel {
    constructor($name, $status, $issues, $agentName, $finishTime, $startTime) {
        this.name = $name;
        this.status = $status;
        this.issues = $issues;
        this.agentName = $agentName;
        this.finishTime = $finishTime;
        this.startTime = $startTime;
    }
    /**
     * Getter $name
     * @return {string}
     */
    get $name() {
        return this.name;
    }
    /**
     * Getter $status
     * @return {TaskStatus}
     */
    get $status() {
        return this.status;
    }
    /**
     * Getter $issues
     * @return {IssueModel[]}
     */
    get $issues() {
        return this.issues;
    }
    /**
     * Getter $agentName
     * @return {string}
     */
    get $agentName() {
        return this.agentName;
    }
    /**
     * Getter $finishTime
     * @return {Date}
     */
    get $finishTime() {
        return this.finishTime;
    }
    /**
     * Getter $startTime
     * @return {Date}
     */
    get $startTime() {
        return this.startTime;
    }
}
exports.TaskModel = TaskModel;
//# sourceMappingURL=TaskModel.js.map