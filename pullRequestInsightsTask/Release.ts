import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { IPipeline } from "./IPipeline";

export class Release implements IPipeline{

    private static readonly DESIRED_DEPLOYMENT_REASON = azureReleaseInterfaces.DeploymentReason.Automated;
    private releaseData: azureReleaseInterfaces.Release;
    private environmentData: azureReleaseInterfaces.ReleaseEnvironment;

    constructor(releaseData: azureReleaseInterfaces.Release){
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
    }


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
        let selectedDeployment = this.getSelectedDeployment(this.environmentData.deploySteps);
        if (this.isComplete()){
            return selectedDeployment.status === azureReleaseInterfaces.DeploymentStatus.Failed;
        }
        for (let phase of selectedDeployment.releaseDeployPhases){
            for (let job of phase.deploymentJobs){
                for (let task of job.tasks){
                    if (this.taskFailed(task)){
                        return true;
                    }
                }
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


