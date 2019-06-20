"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var stats_lite_1 = __importDefault(require("stats-lite"));
var Branch = /** @class */ (function () {
    function Branch(name, pipelines) {
        this.pipelines = pipelines;
        this.name = name;
    }
    Branch.prototype.getPipelineFailStreak = function () {
        var count = 0;
        for (var numberPipeline = 0; numberPipeline < this.pipelines.length; numberPipeline++) {
            if (this.pipelines[numberPipeline].isFailure()) {
                count++;
            }
            else if (this.pipelines[numberPipeline].isComplete()) {
                break;
            }
        }
        tl.debug("number pipelines failing on " + this.name + " is " + count);
        return count;
    };
    Branch.prototype.getMostRecentCompletePipeline = function () {
        for (var _i = 0, _a = this.pipelines; _i < _a.length; _i++) {
            var pipeline = _a[_i];
            if (pipeline.isComplete()) {
                return pipeline;
            }
        }
        return null;
    };
    Branch.prototype.getFullName = function () {
        return this.name;
    };
    Branch.prototype.getTruncatedName = function () {
        var seperatedName = this.name.split(Branch.NAME_SEPERATOR);
        return seperatedName.slice(2).join("");
    };
    Branch.prototype.getPercentileTimesForPipelineTasks = function (percentileToFind, taskIds) {
        var percentileTimesForTasks = new Map();
        for (var _i = 0, taskIds_1 = taskIds; _i < taskIds_1.length; _i++) {
            var taskId = taskIds_1[_i];
            var times = [];
            for (var _a = 0, _b = this.pipelines; _a < _b.length; _a++) {
                var pipeline = _b[_a];
                var taskLength = pipeline.getTaskLength(taskId);
                if (taskLength) {
                    times.push(taskLength);
                }
            }
            if (times.length > 0) {
                percentileTimesForTasks.set(taskId, stats_lite_1.default.percentile(times, percentileToFind));
            }
            else {
                percentileTimesForTasks.set(taskId, null);
                tl.debug("no tasks with id " + taskId + " found on pipelines of branch " + this.name);
            }
        }
        return percentileTimesForTasks;
    };
    Branch.NAME_SEPERATOR = "/";
    return Branch;
}());
exports.Branch = Branch;
