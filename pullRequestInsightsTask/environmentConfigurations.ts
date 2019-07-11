import tl = require('azure-pipelines-task-lib/task');

export class EnvironmentConfigurations{
    public static readonly TEAM_FOUNDATION_KEY: string = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
    public static readonly VSS_CONNECTION_KEY: string = "SYSTEMVSSCONNECTION";
    public static readonly ACCESS_PARAMETER: string = "ACCESSTOKEN";
    public static readonly REPOSITORY_KEY: string = "BUILD_REPOSITORY_NAME";
    public static readonly PULL_REQUEST_ID_KEYS: string[] = ["SYSTEM_PULLREQUEST_PULLREQUESTID", "BUILD_PULLREQUEST_ID"];
    public static readonly PROJECT_KEY: string = "SYSTEM_TEAMPROJECT";
    public static readonly BUILD_ID_KEY: string = "BUILD_BUILDID";
    public static readonly BUILD_NUMBER_KEY: string = "BUILD_BUILDNUMBER";
    public static readonly SOURCE_COMMIT_ITERATION_KEY: string = "BUILD_SOURCEVERSION";
    public static readonly RELEASE_ID_KEY: string = "RELEASE_RELEASEID";
    public static readonly HOST_KEY: string = "SYSTEM_HOSTTYPE";
    public static readonly BUILD_SOURCE_BRANCH_KEY: string = "BUILD_SOURCEBRANCH"; 
    public static readonly PULL_KEY: string = "pull";
    public static readonly SEPERATOR: string = "/";


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