import tl = require('azure-pipelines-task-lib/task');

export class EnvironmentConfigurations{
    public static readonly TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
    public static readonly VSS_CONNECTION_KEY = "SYSTEMVSSCONNECTION";
    public static readonly ACCESS_PARAMETER = "ACCESSTOKEN";
    public static readonly REPOSITORY_KEY = "BUILD_REPOSITORY_NAME";
    public static readonly PULL_REQUEST_ID_KEYS = ["SYSTEM_PULLREQUEST_PULLREQUESTID", "BUILD_PULLREQUEST_ID"];
    public static readonly PROJECT_KEY = "SYSTEM_TEAMPROJECT";
    public static readonly BUILD_ID_KEY = "BUILD_BUILDID";
    public static readonly BUILD_NUMBER_KEY = "BUILD_BUILDNUMBER";
    public static readonly SOURCE_COMMIT_ITERATION_KEY = "BUILD_SOURCEVERSION";
    public static readonly RELEASE_ID_KEY = "RELEASE_RELEASEID";
    public static readonly HOST_KEY = "SYSTEM_HOSTTYPE";
    public static readonly BUILD_SOURCE_BRANCH_KEY = "BUILD_SOURCEBRANCH"; 
    public static readonly PULL_KEY = "pull";
    public static readonly SEPERATOR = "/";


    public getValue(key: string) {
        return this.loadFromEnvironment(key);
    }

    public getAccessKey(): string {
        return tl.getEndpointAuthorizationParameter(EnvironmentConfigurations.VSS_CONNECTION_KEY, EnvironmentConfigurations.ACCESS_PARAMETER, false);
    }

    public getPullRequestId(): number {
        let pullRequestId: number = Number(this.tryKeys(EnvironmentConfigurations.PULL_REQUEST_ID_KEYS));
        let sourceBranch: string[] = this.getValue(EnvironmentConfigurations.BUILD_SOURCE_BRANCH_KEY).split(EnvironmentConfigurations.SEPERATOR);
        if (!pullRequestId && sourceBranch[1] === EnvironmentConfigurations.PULL_KEY) {
            pullRequestId = Number(sourceBranch[2]);
        }
        if (pullRequestId === undefined || isNaN(pullRequestId)) {
            return null;
        }
      return pullRequestId;
    }

    private tryKeys(keys: string[]) {
        let result: string;
        for (let key of keys) {
           result = this.loadFromEnvironment(key);
           if (result){
               break;
           }
        }
        return result;
    }

    private loadFromEnvironment(key: string): string {
        return tl.getVariable(key);
    }
}