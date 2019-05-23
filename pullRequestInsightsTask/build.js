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
    function Build(buildData, originPullRequestId) {
        this.currentBuildData = buildData;
        this.originPullRequestId = originPullRequestId;
    }
    Build.prototype.failed = function () {
        return this.currentBuildData.result === azureBuildInterfaces.BuildResult.Failed;
    };
    Build.prototype.wasRunFromPullRequest = function () {
        return (this.originPullRequestId != null && this.originPullRequestId > 0);
    };
    return Build;
}());
exports.Build = Build;
