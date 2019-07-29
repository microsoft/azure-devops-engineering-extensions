import { PipelineData } from "./config/PipelineData";
import { AzureApiFactory } from "./factories/AzureApiFactory";
import { AbstractAzureApi } from "./dataProviders/AbstractAzureApi";
import tl = require("azure-pipelines-task-lib/task");
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractPipeline } from "./dataModels/AbstractPipeline";
import { TableFactory } from "./factories/TableFactory";
import { ServiceComment } from "./models/ServiceComment";
import { PipelineTask } from "./dataModels/PipelineTask";
import { TelemetryInformation } from "./telemetry/TelemetryInformation";
import { Branch } from "./dataModels/Branch";
import { PullRequest } from "./dataModels/PullRequest";

export class TaskInsights {
  public static readonly NUMBER_PIPELINES_FOR_HEALTH = 3;
  public static readonly MINIMUM_PIPELINES_TO_FETCH_FOR_HEALTH = 10;
  public static readonly NUMBER_PIPELINES_FOR_LONG_RUNNING_VALIDATIONS = 50;
  public static readonly MINIMUM_SECONDS = 1;

  private data: PipelineData;
  private telemetry: TelemetryInformation;
  private azureApi: AbstractAzureApi;
  private currentPipeline: AbstractPipeline;
  private targetBranch: Branch;
  private pullRequest: PullRequest;
  private longRunningValidations: PipelineTask[];

  constructor(data: PipelineData) {
    this.data = data;
    this.telemetry = new TelemetryInformation();
  }

  /**
   * Uses configurations to find failing and long running validations and take appropriate commenting action
   */
  public async invoke(): Promise<void> {
    this.telemetry.postUserConfigurations(
      this.data.isLongRunningValidationFeatureEnabled(),
      this.data.getDurationPercentile(),
      this.data.getMimimumValidationDurationSeconds(),
      this.data.getMimimumValidationRegressionSeconds(),
      this.data.getTaskTypesForLongRunningValidations(),
      this.data.getStatusLink()
    );
    this.azureApi = await AzureApiFactory.create(this.data);
    this.pullRequest = await this.azureApi.getPullRequest(
      this.data.getRepository(),
      this.data.getPullRequestId(),
      this.data.getProjectName()
    );

    if (this.taskIsRunningInMostRecentSourceCommit()) {
      this.currentPipeline = await this.azureApi.getCurrentPipeline(this.data);
      tl.debug(
        "target branch of pull request: " +
          this.pullRequest.getTargetBranchName()
      );
      this.targetBranch = new Branch(this.pullRequest.getTargetBranchName());
      const mostRecentTargetPipelines = await this.azureApi.getMostRecentPipelinesOfCurrentType(
        this.data.getProjectName(),
        this.currentPipeline,
        TaskInsights.MINIMUM_PIPELINES_TO_FETCH_FOR_HEALTH,
        this.targetBranch.getFullName()
      );
      this.targetBranch.setPipelines(
        await this.azureApi.findPipelinesForAndBeforeMergeCommit(
          this.data.getProjectName(),
          mostRecentTargetPipelines,
          this.pullRequest.getLastMergeTargetCommitId()
        )
      );
      let tableType: string = TableFactory.FAILURE;
      tl.debug("pipeline is a failure?: " + this.currentPipeline.isFailure());
      if (!this.currentPipeline.isFailure()) {
        tableType = TableFactory.LONG_RUNNING_VALIDATIONS;
        await this.findAllLongRunningValidations();
      }
      if (this.shouldPRInsightsCommentOccur()) {
        tl.debug("PR Insights should manage comments = true");
        this.manageComments(tableType);
      }
    } else {
      tl.debug(
        this.data.getHostType() + " is not for most recent source commit"
      );
    }
  }

  private taskIsRunningInMostRecentSourceCommit(): boolean {
    return (
      this.pullRequest.getMostRecentSourceCommitId() ===
      this.data.getCurrentSourceCommitIteration()
    );
  }

  private async checkStatusLink(
    currentStatusLink: string,
    project: string
  ): Promise<string> {
    if (!currentStatusLink) {
      currentStatusLink = await this.currentPipeline.getDefinitionLink(
        this.azureApi,
        project
      );
    }
    tl.debug(`Check status link to use: ${currentStatusLink}`);
    return currentStatusLink;
  }

  private async findAllLongRunningValidations(): Promise<void> {
    this.longRunningValidations = [];
    this.targetBranch.setPipelines(
      await this.azureApi.getMostRecentPipelinesOfCurrentType(
        this.data.getProjectName(),
        this.currentPipeline,
        TaskInsights.NUMBER_PIPELINES_FOR_LONG_RUNNING_VALIDATIONS,
        this.targetBranch.getFullName()
      )
    );
    for (const task of this.currentPipeline.getTasks()) {
      const thresholdTime: number = this.targetBranch.getPercentileTimeForPipelineTask(
        this.data.getDurationPercentile(),
        task.getName(),
        task.getId(),
        task.getType()
      );
      task.setRegressionStandards(
        thresholdTime,
        TaskInsights.getMillisecondsFromSeconds(
          this.data.getMimimumValidationDurationSeconds()
        ),
        TaskInsights.getMillisecondsFromSeconds(
          this.data.getMimimumValidationRegressionSeconds()
        )
      );
      if (this.shouldTaskBeAddedToLongRunningValidations(task)) {
        this.longRunningValidations.push(task);
      }
    }
    tl.debug(
      "Number of longRunningValidations = " + this.longRunningValidations.length
    );
    for (const validation of this.longRunningValidations) {
      tl.debug("Name of long running validation = " + validation.getName());
      tl.debug("Threshold time " + validation.getRegressionThreshold());
      tl.debug("Durations of all tasks: " + validation.getAllDurations);
      tl.debug(
        "Number of agents regressed on: " +
          validation.getNumberOfAgentsRegressedOn
      );
      tl.debug(
        "Range of regressive durations " +
          validation.getShortestRegressiveDuration() +
          " - " +
          validation.getLongestRegressiveDuration()
      );
    }
  }

  private shouldTaskBeAddedToLongRunningValidations(
    task: PipelineTask
  ): boolean {
    return (
      task.hasRegressiveInstances() &&
      this.data.getTaskTypesForLongRunningValidations().includes(task.getType())
    );
  }

  private async manageComments(tableType: string): Promise<void> {
    const serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await this.pullRequest.getCurrentServiceCommentThreads(
      this.azureApi
    );
    const serviceComment: ServiceComment = this.pullRequest.makeCurrentIterationComment(
      serviceThreads
    );
    serviceComment.formatNewData(
      tableType,
      this.currentPipeline,
      await this.checkStatusLink(
        this.data.getStatusLink(),
        this.data.getProjectName()
      ),
      this.targetBranch,
      this.longRunningValidations,
      String(this.data.getDurationPercentile()),
      String(TaskInsights.NUMBER_PIPELINES_FOR_HEALTH)
    );
    if (this.pullRequest.hasServiceThreadForExistingIteration(serviceThreads)) {
      this.pullRequest.editServiceComment(this.azureApi, serviceComment);
    } else {
      const currentIterationCommentThreadId: number = (await this.pullRequest.postNewThread(
        this.azureApi,
        serviceComment.getContent(),
        azureGitInterfaces.CommentThreadStatus.Closed
      )).id;
      this.pullRequest.deleteOldComments(
        this.azureApi,
        serviceThreads,
        currentIterationCommentThreadId
      );
    }
  }

  private shouldPRInsightsCommentOccur(): boolean {
    return (
      this.currentPipeline.isFailure() ||
      (this.longRunningValidations.length > 0 &&
        this.data.isLongRunningValidationFeatureEnabled())
    );
  }

  public static getMillisecondsFromSeconds(seconds: number): number {
    if (seconds < this.MINIMUM_SECONDS) {
      seconds = this.MINIMUM_SECONDS;
    }
    return seconds * 1000;
  }
}
