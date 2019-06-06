"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
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
    Branch.prototype.getMostRecentFailedPipeline = function () {
        for (var _i = 0, _a = this.pipelines; _i < _a.length; _i++) {
            var pipeline = _a[_i];
            tl.debug(pipeline.getId() + " : " + String(pipeline.isFailure()));
            if (pipeline.isFailure()) {
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
    Branch.NAME_SEPERATOR = "/";
    return Branch;
}());
exports.Branch = Branch;
