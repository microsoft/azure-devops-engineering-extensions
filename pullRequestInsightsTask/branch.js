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
            //    if (this.pipelines[numberPipeline].hasFailed()){
            if (this.pipelines[numberPipeline].isFailure()) {
                count++;
            }
            else {
                break;
            }
        }
        tl.debug("number builds failing on " + this.name + " is " + count);
        return count;
    };
    Branch.prototype.getMostRecentFailedPipeline = function () {
        for (var _i = 0, _a = this.pipelines; _i < _a.length; _i++) {
            var pipeline = _a[_i];
            // tl.debug(pipeline.getId() + " : " + String(pipeline.hasFailed()));
            // if (pipeline.hasFailed()){
            tl.debug(pipeline.getId() + " : " + String(pipeline.isFailure()));
            if (pipeline.isFailure()) {
                return pipeline;
            }
        }
        return null;
    };
    Branch.prototype.tooManyBuildsFailed = function (failureThreshold) {
        return this.getPipelineFailStreak() >= failureThreshold;
    };
    Branch.prototype.getName = function () {
        return this.name;
    };
    return Branch;
}());
exports.Branch = Branch;
