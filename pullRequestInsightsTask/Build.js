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
    function Build(buildData, timelineData) {
        this.buildData = buildData;
        this.timelineData = timelineData;
    }
    Build.prototype.isFailure = function () {
        if (this.isComplete()) {
            return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
        }
        if (this.timelineData.records) {
            for (var _i = 0, _a = this.timelineData.records; _i < _a.length; _i++) {
                var taskRecord = _a[_i];
                if (this.taskFailed(taskRecord)) {
                    return true;
                }
            }
        }
        return false;
    };
    Build.prototype.isComplete = function () {
        return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
    };
    Build.prototype.getDefinitionId = function () {
        return Number(this.buildData.definition.id);
    };
    Build.prototype.getLink = function () {
        return String(this.buildData._links.web.href);
    };
    Build.prototype.getId = function () {
        return Number(this.buildData.id);
    };
    Build.prototype.getName = function () {
        return this.buildData.buildNumber;
    };
    Build.prototype.taskFailed = function (task) {
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed;
    };
    return Build;
}());
exports.Build = Build;
