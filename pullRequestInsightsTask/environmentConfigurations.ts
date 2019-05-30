import tl = require('azure-pipelines-task-lib/task');
import { AbstractAzureApi } from './AbstractAzureApi';

export class EnvironmentConfigurations{
    private static readonly TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
    private static readonly VSS_CONNECTION_KEY = "SYSTEMVSSCONNECTION";
    private static readonly ACCESS_PARAMETER = "ACCESSTOKEN";
    private static readonly REPOSITORY_KEY = "BUILD_REPOSITORY_NAME";
    private static readonly PULL_REQUEST_ID_KEYS = ["SYSTEM_PULLREQUEST_PULLREQUESTID", "BUILD_PULLREQUEST_ID"];
    private static readonly PROJECT_KEY = "SYSTEM_TEAMPROJECT";
    private static readonly BUILD_ID_KEY = "BUILD_BUILDID";
    private static readonly RELEASE_ID_KEY = "RELEASE_RELEASEID";
    private static readonly HOST_KEY = "SYSTEM_HOSTTYPE";
    private static readonly PULL_REQUEST_TARGET_BRANCH_KEYS = ["SYSTEM_PULLREQUEST_TARGETBRANCH", "BUILD_TARGETBRANCH"];
    private static readonly BUILD_SOURCE_BRANCH_KEY = "BUILD_SOURCEBRANCH"; 
    private static readonly PULL_KEY = "pull";
    private static readonly SEPERATOR = "/";


    public getTeamURI(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.TEAM_FOUNDATION_KEY);
    }

    public getAccessKey(): string {
        return tl.getEndpointAuthorizationParameter(EnvironmentConfigurations.VSS_CONNECTION_KEY, EnvironmentConfigurations.ACCESS_PARAMETER, false);
    }

    public getRepository(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.REPOSITORY_KEY);
    }

    public getPullRequestId(): number {
        let pullRequestId = Number(this.tryKeys(EnvironmentConfigurations.PULL_REQUEST_ID_KEYS));
        if (!pullRequestId && this.getBuildSourceBranch().split(EnvironmentConfigurations.SEPERATOR)[1] === EnvironmentConfigurations.PULL_KEY){
            pullRequestId = Number(this.getBuildSourceBranch().split(EnvironmentConfigurations.SEPERATOR)[2]);
        }
      return pullRequestId;
    }

    public getProjectName(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.PROJECT_KEY);
    }

    public async getTargetBranch(apiCaller: AbstractAzureApi): Promise<string> {
        let targetBranch = this.tryKeys(EnvironmentConfigurations.PULL_REQUEST_TARGET_BRANCH_KEYS);
        if (!targetBranch){
            targetBranch = (await apiCaller.getPullRequestData(this.getRepository(), this.getPullRequestId())).targetRefName;
        }
        return targetBranch;
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

    public getBuildSourceBranch(): string {
        return this.loadFromEnvironment(EnvironmentConfigurations.BUILD_SOURCE_BRANCH_KEY);
    }

    private tryKeys(keys: string[]){
        let result: string;
        for (let key of keys){
           result = this.loadFromEnvironment(key);
           if (result){
               break;
           }
        }
        return result;
    }

    private loadFromEnvironment(key: string): string{
        return tl.getVariable(key);
    }
}