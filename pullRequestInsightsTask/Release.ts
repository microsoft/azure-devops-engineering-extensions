import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { IPipeline } from "./IPipeline";
import { AbstractPipelineTask } from "./AbstractPipelineTask";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { ReleaseTask } from "./ReleaseTask";

export class Release implements IPipeline{

    private releaseData: azureReleaseInterfaces.Release;
    private environmentData: azureReleaseInterfaces.ReleaseEnvironment;
    private selectedDeployment: azureReleaseInterfaces.DeploymentAttempt;
    private tasks: AbstractPipelineTask[] = [];
    private static readonly COMPLETE_DEPLOYMENT_STATUSES = [azureReleaseInterfaces.DeploymentStatus.PartiallySucceeded, azureReleaseInterfaces.DeploymentStatus.Succeeded, azureReleaseInterfaces.DeploymentStatus.Failed];

    constructor(releaseData: azureReleaseInterfaces.Release){
        this.releaseData = releaseData;
        this.environmentData = releaseData.environments[0];
        this.selectedDeployment = this.getSelectedDeployment(this.environmentData.deploySteps);
        for (let phase of this.selectedDeployment.releaseDeployPhases){
            for (let job of phase.deploymentJobs){
                for (let task of job.tasks){
                    this.tasks.push(new ReleaseTask(task));
                }
            }
        }
    }

    private getSelectedDeployment(deploymentAttempts: azureReleaseInterfaces.DeploymentAttempt[]): azureReleaseInterfaces.DeploymentAttempt {
        if (deploymentAttempts && deploymentAttempts.length > 0){
            return deploymentAttempts[0];
        }
        throw(new Error("no deployment attempts available for release with id " + this.getId()));
    }

    public getDefinitionId(): number{
        return Number(this.releaseData.releaseDefinition.id); 
    }

    public getDefinitionName(): string {
        return this.releaseData.releaseDefinition.name;
    }

    public async getDefinitionLink(apiCaller: AbstractAzureApi, project: string): Promise<string> {
        return this.releaseData.releaseDefinition._links.web.href;
    }

    public getEnvironmentDefinitionId(): number{
        return Number(this.environmentData.definitionEnvironmentId);
    }

    public isFailure(): boolean {
        if (this.isComplete()) {
            return this.selectedDeployment.status === azureReleaseInterfaces.DeploymentStatus.Failed;
        }
        for (let task of this.tasks) {
            if (task.ran() && task.wasFailure()) {
                return true;
            }
        }
        return false;
    }
    
    public isComplete(): boolean {
        return Release.COMPLETE_DEPLOYMENT_STATUSES.includes(this.getSelectedDeployment(this.environmentData.deploySteps).status);
    }

    public getLink(): string {
        return String(this.releaseData._links.web.href);
    }

    public getId(): number {
        return Number(this.releaseData.id);
    }

    public getDisplayName(): string {
        return this.releaseData.name;
    }
    
    public getAllTasks(): AbstractPipelineTask[] {
        if (!this.tasks) {
            return null;
        }
        return this.tasks;
    }

    public getTask(taskToGet: AbstractPipelineTask): AbstractPipelineTask {
        if (this.getAllTasks()) {
            for (let task of this.getAllTasks()) {
                if (task.equals(taskToGet)) {
                    return task;
                }
            }
        }
        return null;
    }
}


