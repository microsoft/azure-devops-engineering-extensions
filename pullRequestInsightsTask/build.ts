import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";

export class Build{

    private currentBuildData : azureBuildInterfaces.Build; 
    private originPullRequestId : number;

    constructor(buildData: azureBuildInterfaces.Build, originPullRequestId: number){
        this.currentBuildData = buildData;
        this.originPullRequestId = originPullRequestId;
    }

    public failed () : boolean{
        return this.currentBuildData.result === azureBuildInterfaces.BuildResult.Failed;
    }

    public wasRunFromPullRequest () : boolean {
        return (this.originPullRequestId != null && this.originPullRequestId > 0);
    }
} 