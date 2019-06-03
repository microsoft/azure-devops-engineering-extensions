"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureReleaseInterfaces = __importStar(require("azure-devops-node-api/interfaces/ReleaseInterfaces"));
var Release = /** @class */ (function () {
    function Release(releaseData) {
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
    }
    Release.prototype.getSelectedDeployment = function (DeploymentAttempts) {
        for (var _i = 0, DeploymentAttempts_1 = DeploymentAttempts; _i < DeploymentAttempts_1.length; _i++) {
            var deployment = DeploymentAttempts_1[_i];
            if (deployment.reason === Release.DESIRED_DEPLOYMENT_REASON) {
                return deployment;
            }
        }
        throw (new Error("no deployment attempt available"));
    };
    Release.prototype.getDefinitionId = function () {
        return Number(this.releaseData.releaseDefinition.id);
    };
    Release.prototype.getEnvironmentDefinitionId = function () {
        return Number(this.environmentData.definitionEnvironmentId);
    };
    Release.prototype.isFailure = function () {
        var selectedDeployment = this.getSelectedDeployment(this.environmentData.deploySteps);
        if (this.isComplete()) {
            return selectedDeployment.status === azureReleaseInterfaces.DeploymentStatus.Failed;
        }
        for (var _i = 0, _a = selectedDeployment.releaseDeployPhases; _i < _a.length; _i++) {
            var phase = _a[_i];
            for (var _b = 0, _c = phase.deploymentJobs; _b < _c.length; _b++) {
                var job = _c[_b];
                for (var _d = 0, _e = job.tasks; _d < _e.length; _d++) {
                    var task = _e[_d];
                    if (this.taskFailed(task)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Release.prototype.isComplete = function () {
        return this.getSelectedDeployment(this.environmentData.deploySteps).status !== azureReleaseInterfaces.DeploymentStatus.InProgress;
    };
    Release.prototype.getLink = function () {
        return String(this.releaseData._links.web.href);
    };
    Release.prototype.getId = function () {
        return Number(this.releaseData.id);
    };
    Release.prototype.taskFailed = function (task) {
        return task.status === azureReleaseInterfaces.TaskStatus.Failed || task.status === azureReleaseInterfaces.TaskStatus.Failure;
    };
    Release.DESIRED_DEPLOYMENT_REASON = azureReleaseInterfaces.DeploymentReason.Automated;
    return Release;
}());
exports.Release = Release;
