"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureBuildInterfaces = __importStar(require("azure-devops-node-api/interfaces/BuildInterfaces"));
var Build = /** @class */ (function () {
    function Build(buildData) {
        this.buildData = buildData;
    }
    Build.prototype.failed = function () {
        return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
    };
    Build.prototype.willFail = function (timelineData) {
        var _this = this;
        var failed = false;
        if (timelineData.records !== undefined) {
            timelineData.records.forEach(function (taskRecord) {
                if (_this.taskFailed(taskRecord)) {
                    failed = true;
                }
            });
        }
        return failed;
    };
    Build.prototype.completed = function () {
        return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
    };
    Build.prototype.getDefinitionId = function () {
        if (this.buildData.definition !== undefined && this.buildData.definition.id !== undefined) {
            return this.buildData.definition.id;
        }
        throw (new Error("no definition available"));
    };
    Build.prototype.getLink = function () {
        return String(this.buildData._links.web.href);
    };
    Build.prototype.getId = function () {
        return Number(this.buildData.id);
    };
    Build.prototype.taskFailed = function (task) {
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed;
    };
    return Build;
}());
exports.Build = Build;
