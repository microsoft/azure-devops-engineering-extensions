import { IDataProvider } from "../IDataProvider";
import { Report } from "../../model/Report";
import { IPipelineRestClient } from "../restclients/IPipelineRestClient";
import { PipelineNotFoundError } from "../../exceptions/PipelineNotFoundError";
import { Release, ReleaseEnvironment, DeployPhaseStatus, DeploymentJob, Artifact } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { DataProviderError } from "../../exceptions/DataProviderError";
import { PhaseModel } from "../../model/PhaseModel";
import { EnvironmentExtensions } from "../../utils/EnvironmentExtensions";
import { JobModel } from "../../model/JobModel";
import { TaskModel } from "../../model/TaskModel";
import { IssueModel } from "../../model/IssueModel";
import { ChangeModel } from "../../model/ChangeModel";
import { ReleaseReport } from "../../model/ReleaseReport";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { ReportFactory } from "../../model/ReportFactory";

export class ReleaseDataProvider implements IDataProvider {

  private pipelineRestClient: IPipelineRestClient;

  constructor(pipelineRestClient: IPipelineRestClient) {
    this.pipelineRestClient = pipelineRestClient;
  }

  async getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report> {
    const report = ReportFactory.createNewReport(pipelineConfig) as ReleaseReport;
    const release = await this.pipelineRestClient.getPipelineAsync() as Release;
    if (release == null) {
      throw new PipelineNotFoundError(`ProjectId: ${pipelineConfig.$projectId}, ${pipelineConfig.$pipelineId}`);
    }

    const environment = this.getEnvironment(release, pipelineConfig);
    const phases = this.getPhases(environment);
    const lastCompletedRelease = await this.getReleaseByLastCompletedEnvironmentAsync(pipelineConfig, release, environment);

    let changes: ChangeModel[] = [];
    // check if last completed one isn't latter one, then changes don't make sense
    if (lastCompletedRelease != null && lastCompletedRelease.id < release.id) {
      console.log(`Getting changes between releases ${release.id} & ${lastCompletedRelease.id}`);
      changes = await this.pipelineRestClient.getPipelineChangesAsync(lastCompletedRelease.id);
    }
    else {
      console.log("Unable to find any last completed release");
    }

    console.log("Fetched release data");
    report.setReleaseData(release, environment, lastCompletedRelease, phases, changes);

    return report;
  }

  private getEnvironment(release: Release, pipelineConfig: PipelineConfiguration): ReleaseEnvironment {
    let environment: ReleaseEnvironment;
    const environments = release.environments;
    for (var i: number = 0; i < environments.length; i++) {
      if (environments[i].id == pipelineConfig.$environmentId) {
        environment = environments[i];
        break;
      }
    }

    if (pipelineConfig.$usePreviousEnvironment && environments.indexOf(environment) > 0) {
      environment = environments[environments.indexOf(environment) - 1];
    }

    if (environment != null) {
      return environment;
    }

    throw new DataProviderError(`Unable to find environment with environment id - ${pipelineConfig.$environmentId} in release - ${release.id}`);
  }

  private getPhases(environment: ReleaseEnvironment): PhaseModel[] {
    var releaseDeployPhases = EnvironmentExtensions.getPhases(environment);
    return releaseDeployPhases.map(r => new PhaseModel(r.name, this.getJobModelsFromPhase(r.deploymentJobs), DeployPhaseStatus[r.status], r.rank));
  }

  private getJobModelsFromPhase(deploymentJobs: DeploymentJob[]): JobModel[] {
    const jobModels = deploymentJobs.map(job => {
      const issues = job.job.issues.map(i => new IssueModel(i.issueType, i.message));
      const tasks = job.tasks.map(t => {
        const issues = t.issues.map(i => new IssueModel(i.issueType, i.message));
        return new TaskModel(t.name, t.status, issues, t.agentName, t.finishTime, t.startTime);
      });
      return new JobModel(job.job.name, job.job.status, issues, tasks);
    });
    return jobModels;
  }

  private async getReleaseByLastCompletedEnvironmentAsync(pipelineConfig: PipelineConfiguration, release: Release, environment: ReleaseEnvironment): Promise<Release> {
    let branchId: string = null;

    if (release.artifacts != null && release.artifacts.length > 0) {
      const primaryArtifact = release.artifacts.filter(a => a.isPrimary)[0];
      const defRef = primaryArtifact.definitionReference["branch"];
      branchId = defRef != null ? defRef.id : null;
    }

    console.log(`Fetching last release by completed environment id - ${pipelineConfig.$environmentId} and branch id ${branchId}`);
    const lastRelease = await this.pipelineRestClient.getLastPipelineAsync(release.releaseDefinition.id, 
      environment.definitionEnvironmentId, branchId, null); //Bug in API - release.createdOn);
    return lastRelease as Release;
  }
}