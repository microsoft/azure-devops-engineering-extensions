import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { IPipeline } from "./IPipeline";

export class Release implements IPipeline{

    // private apiCaller: AzureApi;
    // private project: string;
    // private id: number;
    private static readonly DESIRED_DEPLOYMENT_REASON = azureReleaseInterfaces.DeploymentReason.Automated;
    private releaseData: azureReleaseInterfaces.Release;
    private environmentData: azureReleaseInterfaces.ReleaseEnvironment;

    constructor(releaseData: azureReleaseInterfaces.Release){
        // this.apiCaller = apiCaller;
        // this.project = project;
        // this.id = id;
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
    }

    // public async loadData(): Promise<void> {
    //     this.releaseData = await this.apiCaller.getRelease(this.project, this.id);
    // }
    private getSelectedDeployment(DeploymentAttempts: azureReleaseInterfaces.DeploymentAttempt[]): azureReleaseInterfaces.DeploymentAttempt {
        for (let deployment of DeploymentAttempts){
            if (deployment.reason === Release.DESIRED_DEPLOYMENT_REASON){
                return deployment; 
            }
        }
        throw(new Error("no deployment attempt available"));
    }
    public getDefinitionId(): number{
        return Number(this.releaseData.releaseDefinition.id); 
    }

    public getEnvironmentDefinitionId(): number{
        return Number(this.environmentData.definitionEnvironmentId);
    }

    public isFailure() : boolean{
        if (this.isComplete()){
            //return this.selectDeployment(this.environmentData.deploySteps) === azureReleaseInterfaces.DeploymentStatus.Failed;
        }
        for (let task of this.getSelectedDeployment(this.environmentData.deploySteps).tasks){
            if (this.taskFailed(task)){
                return true;
            }
        }
        return false;
    }
    
    public isComplete(): boolean{
        return this.getSelectedDeployment(this.environmentData.deploySteps).status !== azureReleaseInterfaces.DeploymentStatus.InProgress;
    }

    public getLink(): string{
        return String(this.releaseData._links.web.href);
    }

    public getId(): number{
        return Number(this.releaseData.id);
    }

    private taskFailed(task: azureReleaseInterfaces.ReleaseTask): boolean{
        return task.status === azureReleaseInterfaces.TaskStatus.Failed || task.status === azureReleaseInterfaces.TaskStatus.Failure;
    }
}


