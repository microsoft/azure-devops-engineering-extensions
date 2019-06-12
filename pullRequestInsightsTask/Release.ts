import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { IPipeline } from "./IPipeline";

export class Release implements IPipeline{

    private releaseData: azureReleaseInterfaces.Release;
    private environmentData: azureReleaseInterfaces.ReleaseEnvironment;
    private static readonly COMPLETE_STATUSES = [azureReleaseInterfaces.DeploymentStatus.PartiallySucceeded, azureReleaseInterfaces.DeploymentStatus.Succeeded, azureReleaseInterfaces.DeploymentStatus.Failed];

    constructor(releaseData: azureReleaseInterfaces.Release){
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
    }

    private getSelectedDeployment(deploymentAttempts: azureReleaseInterfaces.DeploymentAttempt[]): azureReleaseInterfaces.DeploymentAttempt {
        if (deploymentAttempts.length > 0){
            return deploymentAttempts[0];
        }
        throw(new Error("no deployment attempts available for release with id " + this.getId()));
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
    
    public isComplete(): boolean {
        return Release.COMPLETE_STATUSES.includes(this.getSelectedDeployment(this.environmentData.deploySteps).status);
    }

    public getLink(): string {
        return String(this.releaseData._links.web.href);
    }

    public getId(): number {
        return Number(this.releaseData.id);
    }

    public getDisplayName(): string {
        return this.releaseData.name + "/" + this.getEnvironmentName();
    }

    public getEnvironmentName(): string {
        return this.environmentData.name;
    }

    private taskFailed(task: azureReleaseInterfaces.ReleaseTask): boolean {
        return task.status === azureReleaseInterfaces.TaskStatus.Failed || task.status === azureReleaseInterfaces.TaskStatus.Failure;
    }
}


