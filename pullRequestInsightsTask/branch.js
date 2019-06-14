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
    Branch.prototype.tooManyPipelinesFailed = function (failureThreshold) {
        return this.getPipelineFailStreak() >= failureThreshold;
    };
    Branch.prototype.getFullName = function () {
        return this.name;
    };
    Branch.prototype.getTruncatedName = function () {
        var seperatedName = this.name.split(Branch.NAME_SEPERATOR);
        return seperatedName.slice(2).join("");
    };
    Branch.prototype.getPercentileTimeForPipelineTask = function (percentileToFind, taskId) {
        var lengths = [];
        for (var _i = 0, _a = this.pipelines; _i < _a.length; _i++) {
            var pipeline = _a[_i];
            var taskLength = pipeline.getTaskLength(taskId);
            if (taskLength) {
                lengths.push(taskLength);
            }
        }
        if (lengths.length > 0) {
            return stats_lite_1.default.percentile(lengths, percentileToFind);
        }
        tl.debug("no tasks with id " + taskId + " found on pipelines of branch " + this.name);
        return null;
    };
    Branch.NAME_SEPERATOR = "/";
    return Branch;
}());
exports.Branch = Branch;
