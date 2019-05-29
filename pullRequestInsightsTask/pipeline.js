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
var azureReleaseInterfaces = __importStar(require("azure-devops-node-api/interfaces/ReleaseInterfaces"));
var Release = /** @class */ (function () {
    function Release(releaseData) {
        // this.apiCaller = apiCaller;
        // this.project = project;
        // this.id = id;
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
    }
    // public async loadData(): Promise<void> {
    //     this.releaseData = await this.apiCaller.getRelease(this.project, this.id);
    // }
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
        if (this.isComplete()) {
            //return this.selectDeployment(this.environmentData.deploySteps) === azureReleaseInterfaces.DeploymentStatus.Failed;
        }
        for (var _i = 0, _a = this.getSelectedDeployment(this.environmentData.deploySteps).tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            if (this.taskFailed(task)) {
                return true;
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
    // private apiCaller: AzureApi;
    // private project: string;
    // private id: number;
    Release.DESIRED_DEPLOYMENT_REASON = azureReleaseInterfaces.DeploymentReason.Automated;
    return Release;
}());
exports.Release = Release;
var Build = /** @class */ (function () {
    function Build(buildData, timelineData) {
        // this.apiCaller = apiCaller;
        // this.project = project;
        this.buildData = buildData;
        this.timelineData = timelineData;
    }
    // public async loadData(): Promise<void> {
    //     this.buildData = await this.apiCaller.getBuild(this.project, this.id);
    //     this.timelineData = await this.apiCaller.getBuildTimeline(this.project, this.id);
    // }
    // public hasFailed() : boolean{
    //     return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
    // }
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
    Build.prototype.taskFailed = function (task) {
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed;
    };
    return Build;
}());
exports.Build = Build;
