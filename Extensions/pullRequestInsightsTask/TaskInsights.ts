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

/**
 * This class represents the logic of the PR Insights task
 * Finds failure or long running validation data and posts it to pull request page as a comment
 */
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
    this.longRunningValidations = [];
  }

  /**
   * Uses configurations to find failing and long running validations and take appropriate commenting action
   */
  public async invoke(): Promise<void> {
    this.telemetry.addUserConfigurations(
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
      this.telemetry.setPipelineData(
        this.currentPipeline.getId(),
        this.data.getHostType()
      );
      console.log(
        "target branch of pull request: " +
          this.pullRequest.getTargetBranchName()
      );
      this.targetBranch = new Branch(this.pullRequest.getTargetBranchName());
      await this.setTargetBranchPipelines(
        TaskInsights.MINIMUM_PIPELINES_TO_FETCH_FOR_HEALTH
      );
      let firstTableType: string = TableFactory.FAILURE;
      let secondTableType: string | undefined = undefined;
      this.telemetry.setWasFailureFound(this.currentPipeline.isFailure());
      if (!this.currentPipeline.isFailure()) {
        firstTableType = TableFactory.LONG_RUNNING_VALIDATIONS;
        await this.findAllLongRunningValidations();
      }
      this.telemetry.setWasRegressionFound(
        this.longRunningValidations.length > 0
      );
      if (this.longRunningValidations.length > 0) {
        secondTableType = TableFactory.LONG_RUNNING_VALIDATIONS;
      }
      if (this.shouldPRInsightsCommentOccur()) {
        this.manageComments(firstTableType, secondTableType);
      }
      this.telemetry.logTaskResults();
    } else {
      console.log(
        this.data.getHostType() + " is not for most recent source commit"
      );
    }
  }

  /**
   * Checks to see if current iteration of PR Insights task is running within most recent commit of pull request
   */
  private taskIsRunningInMostRecentSourceCommit(): boolean {
    console.log(
      "most recent source commit = " +
        this.pullRequest.getMostRecentSourceCommitId()
    );
    console.log(
      "current commit = " + this.data.getCurrentSourceCommitIteration()
    );
    return (
      this.pullRequest.getMostRecentSourceCommitId() ===
      this.data.getCurrentSourceCommitIteration()
    );
  }

  /**
   * Sets pipelines which ran prior to and for the pull request merge commit on target branch
   * @param maxNumber Maximum number of pipelines to include
   */
  private async setTargetBranchPipelines(maxNumber: number): Promise<void> {
    this.targetBranch.setPipelines(
      await this.azureApi.findPipelinesForAndBeforeMergeCommit(
        this.data.getProjectName(),
        this.pullRequest.getLastMergeTargetCommitId(),
        this.currentPipeline,
        maxNumber,
        this.targetBranch.getFullName()
      )
    );
  }

  /**
   * Checks to validation status link input as configuration
   * If none is present, defaults status link to be definition summary link for current pipelines
   * @param currentStatusLink String that status link is currently set to
   * @param project Name of project current pipeline is running within
   */
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
    console.log(`Check status link to use: ${currentStatusLink}`);
    return currentStatusLink;
  }

  /**
   * Finds all long running validations in current pipeline
   */
  private async findAllLongRunningValidations(): Promise<void> {
    await this.setTargetBranchPipelines(
      TaskInsights.NUMBER_PIPELINES_FOR_LONG_RUNNING_VALIDATIONS
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
    console.log(
      "Number of longRunningValidations = " + this.longRunningValidations.length
    );
    for (const validation of this.longRunningValidations) {
      console.log("Name of long running validation = " + validation.getName());
      console.log("Threshold time " + validation.getRegressionThreshold());
      console.log(
        "Durations of all task run instances for all agents in this pipeline: " +
          validation.getAllDurations()
      );
      console.log(
        "Number of agents regressed on: " +
          validation.getNumberOfAgentsRegressedOn()
      );
      tl.debug(
        "Range of regressive durations " +
          validation.getShortestRegressiveDuration() +
          " - " +
          validation.getLongestRegressiveDuration()
      );
    }
  }

  /**
   * Determines if a single task should be added to long running validations based on task regression and user configurations
   * @param task Task to consider for long running validations
   */
  private shouldTaskBeAddedToLongRunningValidations(
    task: PipelineTask
  ): boolean {
    return (
      task.hasRegressiveInstances() &&
      (!this.data.getTaskTypesForLongRunningValidations() ||
        this.data
          .getTaskTypesForLongRunningValidations()
          .includes(task.getType()))
    );
  }

  /**
   * Performs commenting actions by posting a new comment or editing an existing one with failure or long running validation table data
   * Upon posting new comment, calls for old PR Insights comments to be deleted
   * @param tableType Type of information table to create/add to
   */
  private async manageComments(tableType: string, secondTableType?: string): Promise<void> {
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
      String(TaskInsights.NUMBER_PIPELINES_FOR_HEALTH),
      this.data.getFeedbackLine()
      );
    if (secondTableType) {
      serviceComment.formatNewData(
        secondTableType,
        this.currentPipeline,
        await this.checkStatusLink(
          this.data.getStatusLink(),
          this.data.getProjectName()
        ),
        this.targetBranch,
        this.longRunningValidations,
        String(this.data.getDurationPercentile()),
        String(TaskInsights.NUMBER_PIPELINES_FOR_HEALTH),
        this.data.getFeedbackLine()
      );
    }
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

  /**
   * Determines if commenting is needed for either validation failures or
   * long running validations
   */
  private shouldPRInsightsCommentOccur(): boolean {
    const shouldCommentOccur =
      this.currentPipeline.isFailure() ||
      (this.longRunningValidations.length > 0 &&
        this.data.isLongRunningValidationFeatureEnabled());
    this.telemetry.setWasCommentNeeded(shouldCommentOccur);
    return shouldCommentOccur;
  }

  /**
   * Converts seconds into milliseconds
   * @param seconds Number of seconds to convert
   */
  public static getMillisecondsFromSeconds(seconds: number): number {
    if (seconds < this.MINIMUM_SECONDS) {
      seconds = this.MINIMUM_SECONDS;
    }
    return seconds * 1000;
  }
}
