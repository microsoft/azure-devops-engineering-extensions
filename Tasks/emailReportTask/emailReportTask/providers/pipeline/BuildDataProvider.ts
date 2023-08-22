import { IDataProvider } from "../IDataProvider";
import { Report } from "../../model/Report";
import { PipelineNotFoundError } from "../../exceptions/PipelineNotFoundError";
import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { PhaseModel } from "../../model/PhaseModel";
import { JobModel } from "../../model/JobModel";
import { TaskModel } from "../../model/TaskModel";
import { IssueModel } from "../../model/IssueModel";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { ReportFactory } from "../../model/ReportFactory";
import { BuildReport } from "../../model/BuildReport";
import { IPipelineRestClient } from "../restclients/IPipelineRestClient";
import { Build, TaskResult, TimelineRecord, IssueType } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Timeline } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { isNullOrUndefined } from "util";
import { RetryablePromise } from "../restclients/RetryablePromise";
import { DataProviderError } from "../../exceptions/DataProviderError";

export class BuildDataProvider implements IDataProvider {

  private pipelineRestClient: IPipelineRestClient;

  constructor(pipelineRestClient: IPipelineRestClient) {
    this.pipelineRestClient = pipelineRestClient;
  }

  public async getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report> {
    const report = ReportFactory.createNewReport(pipelineConfig) as BuildReport;
    const build = await this.getBuildAsync(pipelineConfig);
    if (build == null) {
      throw new PipelineNotFoundError(`ProjectId: ${pipelineConfig.$projectId}, ${pipelineConfig.$pipelineId}`);
    }

    const timeline = await RetryablePromise.RetryAsync(async () => this.pipelineRestClient.getPipelineTimelineAsync(build.id), "GetBuildTimeline");
    const changes = await RetryablePromise.RetryAsync(async () => this.pipelineRestClient.getPipelineChangesAsync(build.id), "GetPipelineChanges");
    const phases = this.getPhases(timeline);
    const lastCompletedBuild = await this.pipelineRestClient.getLastPipelineAsync(build.definition.id, null, build.sourceBranch) as Build;
    const lastCompletedTimeline = lastCompletedBuild != null ? await RetryablePromise.RetryAsync(async () => this.pipelineRestClient.getPipelineTimelineAsync(lastCompletedBuild.id), "GetLastCompletedTimeline") : null;

    console.log("Fetched release data");
    report.setBuildData(build, timeline, lastCompletedBuild, lastCompletedTimeline, phases, changes);

    return report;
  }

  private async getBuildAsync(pipelineConfig: PipelineConfiguration): Promise<Build> {
    var build = await RetryablePromise.RetryAsync(async () => this.pipelineRestClient.getPipelineAsync(), "GetPipeline");
    if(isNullOrUndefined(build)) {
      throw new DataProviderError(`Unable to find build with id: ${pipelineConfig.$pipelineId}`);
    }
    return build as Build;
  }

  private getPhases(timeline: Timeline): PhaseModel[] {
    const records = timeline.records.sort( (a: TimelineRecord, b: TimelineRecord) => this.getOrder(a) - this.getOrder(b));
    const phases = records.filter(r => r.type == "Phase");
    if(phases.length > 0) {
      const jobs = records.filter(r => r.type == "Job");
      if(jobs.length > 0) {
        const tasks = records.filter(r => r.type == "Task");
        const phaseModels = phases.map(phase => {
          const jobModels = jobs
            .filter(j => j.parentId == phase.id)
            .map(j => {
              const tasksForThisJob = tasks.filter(t => t.parentId == j.id);
              const taskModels = tasksForThisJob.map(task => {
                const issues: IssueModel[] = isNullOrUndefined(task.issues) || task.issues.length < 1 ? [] :
                  task.issues.map(i => new IssueModel(i.type == IssueType.Error ? "Error" : "Warning", i.message));
                return new TaskModel(task.name, this.getTaskState(task.result), issues, task.workerName, task.finishTime, task.startTime);
              });
              return new JobModel(j.name, this.getTaskState(j.result), [], taskModels);
          });
          return new PhaseModel(
            phase.name, 
            jobModels,
            isNullOrUndefined(phase.result) ? "Unknown" : phase.result.toString(),            
            this.getOrder(phase));
        });
        return phaseModels;
      }
    }
    return [];
  }

  private getTaskState(result: TaskResult): TaskStatus
  {
      switch (result)
      {
          case TaskResult.Succeeded:
              return TaskStatus.Succeeded;

          case TaskResult.SucceededWithIssues:
              return TaskStatus.PartiallySucceeded;
              
          case TaskResult.Failed:
              return TaskStatus.Failed;
              
          case TaskResult.Canceled:
              return TaskStatus.Canceled;
              
          case TaskResult.Skipped:
              return TaskStatus.Skipped;
              
          default:
              return TaskStatus.Unknown;
      }
    }

    private getOrder(timelineRecord: TimelineRecord) {
      return isNullOrUndefined(timelineRecord.order) ? 0 : timelineRecord.order;
    }
  }