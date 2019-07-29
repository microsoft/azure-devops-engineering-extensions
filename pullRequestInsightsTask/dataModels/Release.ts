import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { AbstractPipeline } from "./AbstractPipeline";
import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import { AbstractAzureApi } from "../dataProviders/AbstractAzureApi";
import { ReleaseTaskRun } from "./ReleaseTaskRun";
import tl = require("azure-pipelines-task-lib/task");

export class Release extends AbstractPipeline {
  private releaseData: azureReleaseInterfaces.Release;
  private environmentData: azureReleaseInterfaces.ReleaseEnvironment;
  private selectedDeployment: azureReleaseInterfaces.DeploymentAttempt;
  public static readonly COMPLETE_DEPLOYMENT_STATUSES = [
    azureReleaseInterfaces.DeploymentStatus.PartiallySucceeded,
    azureReleaseInterfaces.DeploymentStatus.Succeeded,
    azureReleaseInterfaces.DeploymentStatus.Failed
  ];

  constructor(releaseData: azureReleaseInterfaces.Release) {
    super();
    this.releaseData = releaseData;
    this.environmentData = releaseData.environments[0];
    this.selectedDeployment = this.getSelectedDeployment(
      this.environmentData.deploySteps
    );
    this.addTaskRuns(this.parseForTasks());
  }

  public getDefinitionId(): number {
    return Number(this.releaseData.releaseDefinition.id);
  }

  public getDefinitionName(): string {
    return this.releaseData.releaseDefinition.name;
  }

  public async getDefinitionLink(
    apiCaller: AbstractAzureApi,
    project: string
  ): Promise<string> {
    return this.releaseData.releaseDefinition._links.web.href;
  }

  public getEnvironmentDefinitionId(): number {
    return Number(this.environmentData.definitionEnvironmentId);
  }

  public isFailure(): boolean {
    if (this.isComplete()) {
      return (
        this.selectedDeployment.status ===
        azureReleaseInterfaces.DeploymentStatus.Failed
      );
    }
    return this.taskFailedDuringRun();
  }

  public isComplete(): boolean {
    return Release.COMPLETE_DEPLOYMENT_STATUSES.includes(
      this.getSelectedDeployment(this.environmentData.deploySteps).status
    );
  }

  public getLink(): string {
    return String(this.releaseData._links.web.href);
  }

  public getId(): number {
    return Number(this.releaseData.id);
  }

  public getName(): string {
    return this.releaseData.name;
  }

  public getTriggeringArtifactAlias(): string {
    if (this.releaseData.artifacts) {
      for (const artifact of this.releaseData.artifacts) {
        if (artifact.isPrimary) {
          return artifact.alias;
        }
      }
    }
    return null;
  }

  private parseForTasks(): AbstractPipelineTaskRun[] {
    const tasks: AbstractPipelineTaskRun[] = [];
    try {
      for (const phase of this.selectedDeployment.releaseDeployPhases) {
        for (const job of phase.deploymentJobs) {
          for (const taskInstanceRecord of job.tasks) {
            tasks.push(
              new ReleaseTaskRun(
                taskInstanceRecord.task,
                taskInstanceRecord.name,
                taskInstanceRecord.startTime,
                taskInstanceRecord.finishTime,
                taskInstanceRecord.agentName,
                taskInstanceRecord.status
              )
            );
          }
        }
      }
    } catch (err) {
      tl.debug("Warning: Release " + this.getName() + " is missing task data");
    }
    return tasks;
  }

  private getSelectedDeployment(
    deploymentAttempts: azureReleaseInterfaces.DeploymentAttempt[]
  ): azureReleaseInterfaces.DeploymentAttempt {
    if (deploymentAttempts && deploymentAttempts.length > 0) {
      return deploymentAttempts[0];
    }
    throw new Error(
      "no deployment attempts available for release with id " + this.getId()
    );
  }
}
