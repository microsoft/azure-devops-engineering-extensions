"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var EnvironmentConfigurations = /** @class */ (function () {
    function EnvironmentConfigurations() {
    }
    EnvironmentConfigurations.prototype.getTeamURI = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.TEAM_FOUNDATION_KEY);
    };
    EnvironmentConfigurations.prototype.getAccessKey = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.ACCESS_KEY);
    };
    EnvironmentConfigurations.prototype.getRepository = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.REPOSITORY_KEY);
    };
    EnvironmentConfigurations.prototype.getPullRequestId = function () {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.PULL_REQUEST_ID_KEY));
    };
    EnvironmentConfigurations.prototype.getProjectName = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.PROJECT_KEY);
    };
    EnvironmentConfigurations.prototype.getBuildId = function () {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.BUILD_ID_KEY));
    };
    EnvironmentConfigurations.prototype.getTargetBranch = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.PULL_REQUEST_TARGET_BRANCH);
    };
    EnvironmentConfigurations.prototype.loadFromEnvironment = function (key) {
        return tl.getVariable(key);
    };
    EnvironmentConfigurations.TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
    EnvironmentConfigurations.ACCESS_KEY = "SYSTEM_ACCESSTOKEN";
    EnvironmentConfigurations.REPOSITORY_KEY = "BUILD_REPOSITORY_NAME";
    EnvironmentConfigurations.PULL_REQUEST_ID_KEY = "SYSTEM_PULLREQUEST_PULLREQUESTID";
    EnvironmentConfigurations.PROJECT_KEY = "SYSTEM_TEAMPROJECT";
    EnvironmentConfigurations.BUILD_ID_KEY = "BUILD_BUILDID";
    EnvironmentConfigurations.PULL_REQUEST_TARGET_BRANCH = "SYSTEM_PULLREQUEST_TARGETBRANCH";
    return EnvironmentConfigurations;
}());
exports.EnvironmentConfigurations = EnvironmentConfigurations;
