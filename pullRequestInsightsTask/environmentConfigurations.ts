import tl = require('azure-pipelines-task-lib/task');

export class EnvironmentConfigurations{
    private static readonly TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
  //  private static readonly COLLECTION_URI_KEY = "SYSTEM_COLLECTIONURI";
    private static readonly VSS_CONNECTION_KEY = "SYSTEMVSSCONNECTION";
    private static readonly ACCESS_PARAMETER = "ACCESSTOKEN";
    private static readonly REPOSITORY_KEY = "BUILD_REPOSITORY_NAME";
    private static readonly PULL_REQUEST_ID_KEY = "SYSTEM_PULLREQUEST_PULLREQUESTID";
    private static readonly PROJECT_KEY = "SYSTEM_TEAMPROJECT";
    private static readonly BUILD_ID_KEY = "BUILD_BUILDID";
    private static readonly RELEASE_ID_KEY = "RELEASE_RELEASEID";
    private static readonly HOST_KEY = "SYSTEM_HOSTTYPE";
    private static readonly PULL_REQUEST_TARGET_BRANCH = "SYSTEM_PULLREQUEST_TARGETBRANCH";


    public getTeamURI(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.TEAM_FOUNDATION_KEY);
    }

    // public getCollectionURI(): string {
    //     return this.loadFromEnvironment(EnvironmentConfigurations.COLLECTION_URI_KEY);
    // }

    public getAccessKey(): string {
        return tl.getEndpointAuthorizationParameter(EnvironmentConfigurations.VSS_CONNECTION_KEY, EnvironmentConfigurations.ACCESS_PARAMETER, false);
    }

    public getRepository(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.REPOSITORY_KEY);
    }

    public getPullRequestId(): number {
       return Number(this.loadFromEnvironment(EnvironmentConfigurations.PULL_REQUEST_ID_KEY));
      // return Number(this.loadFromEnvironment("RELEASE_ARTIFACTS_" + "EPSTEAM_ZEROINJURY" + "_PULLREQUEST_TARGETBRANCH"));
    }

    public getProjectName(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.PROJECT_KEY);
    }

    public getTargetBranch(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.PULL_REQUEST_TARGET_BRANCH);
    }

    public getHostType(): string{
        return this.loadFromEnvironment(EnvironmentConfigurations.HOST_KEY);
    }

    public getReleaseId(): number {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.RELEASE_ID_KEY));
    }

    public getBuildId(): number {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.BUILD_ID_KEY));
    }

    private loadFromEnvironment (key: string): string{
        return tl.getVariable(key);
    }
}