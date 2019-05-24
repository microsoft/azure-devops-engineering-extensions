import tl = require('azure-pipelines-task-lib/task');

export class EnvironmentConfigurations{
    private static readonly TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
    private static readonly ACCESS_KEY = "SYSTEM_ACCESSTOKEN";
    private static readonly REPOSITORY_KEY = "BUILD_REPOSITORY_NAME";
    private static readonly PULL_REQUEST_ID_KEY = "SYSTEM_PULLREQUEST_PULLREQUESTID";
    private static readonly PROJECT_KEY = "SYSTEM_TEAMPROJECT";
    private static readonly BUILD_ID_KEY = "BUILD_BUILDID";
    private static readonly PULL_REQUEST_TARGET_BRANCH = "SYSTEM_PULLREQUEST_TARGETBRANCH";

    public getTeamURI(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.TEAM_FOUNDATION_KEY);
    }

    public getAccessKey(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.ACCESS_KEY);
    }

    public getRepository(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.REPOSITORY_KEY);
    }

    public getPullRequestId(): number {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.PULL_REQUEST_ID_KEY));
    }

    public getProjectName(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.PROJECT_KEY);
    }

    public getBuildId(): number {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.BUILD_ID_KEY));
    }

    public getTargetBranch(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.PULL_REQUEST_TARGET_BRANCH);
    }
    private loadFromEnvironment (key : string){
        return tl.getVariable(key);
    }
}