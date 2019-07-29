import tl = require("azure-pipelines-task-lib/task");

export class EnvironmentConfigurations {
  public static readonly TEAM_FOUNDATION_KEY: string =
    "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
  public static readonly VSS_CONNECTION_KEY: string = "SYSTEMVSSCONNECTION";
  public static readonly ACCESS_PARAMETER: string = "ACCESSTOKEN";
  public static readonly REPOSITORY_KEY: string = "BUILD_REPOSITORY_NAME";
  public static readonly PULL_REQUEST_ID_KEYS: string[] = [
    "SYSTEM_PULLREQUEST_PULLREQUESTID",
    "BUILD_PULLREQUEST_ID"
  ];
  public static readonly PROJECT_KEY: string = "SYSTEM_TEAMPROJECT";
  public static readonly BUILD_ID_KEY: string = "BUILD_BUILDID";
  public static readonly BUILD_NUMBER_KEY: string = "BUILD_BUILDNUMBER";
  public static readonly SOURCE_COMMIT_ITERATION_KEY: string =
    "BUILD_SOURCEVERSION";
  public static readonly RELEASE_ID_KEY: string = "RELEASE_RELEASEID";
  public static readonly HOST_KEY: string = "SYSTEM_HOSTTYPE";
  public static readonly BUILD_SOURCE_BRANCH_KEY: string = "BUILD_SOURCEBRANCH";
  public static readonly PULL_KEY: string = "pull";
  public static readonly SEPERATOR: string = "/";

  /**
   * Fetches environment variable from system using a key
   * @param key String with which to fetch value
   */
  public getValue(key: string) {
    return tl.getVariable(key);
  }

  /**
   * Gets access token from system
   */
  public getAccessKey(): string {
    return tl.getEndpointAuthorizationParameter(
      EnvironmentConfigurations.VSS_CONNECTION_KEY,
      EnvironmentConfigurations.ACCESS_PARAMETER,
      false
    );
  }

  /**
   * Gets id of pull request of pipeline task is running within, returns null if pipeline is not within pull request
   */
  public getPullRequestId(): number {
    let pullRequestId: number = Number(
      this.tryKeys(EnvironmentConfigurations.PULL_REQUEST_ID_KEYS)
    );
    const sourceBranch: string[] = this.getValue(
      EnvironmentConfigurations.BUILD_SOURCE_BRANCH_KEY
    ).split(EnvironmentConfigurations.SEPERATOR);
    if (
      !pullRequestId &&
      sourceBranch[1] === EnvironmentConfigurations.PULL_KEY
    ) {
      pullRequestId = Number(sourceBranch[2]);
    }
    if (pullRequestId === undefined || isNaN(pullRequestId)) {
      return null;
    }
    return pullRequestId;
  }

  /**
   * Attempts to load several keys from the environment and stops when a valid variable is found
   */
  private tryKeys(keys: string[]) {
    let result: string;
    for (const key of keys) {
      result = this.getValue(key);
      if (result) {
        break;
      }
    }
    return result;
  }
}
