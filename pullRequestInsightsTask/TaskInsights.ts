import { PipelineData } from "./PipelineData";
import { AzureApiFactory } from "./AzureApiFactory";
import { Branch } from "./Branch";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { PullRequest } from "./PullRequest";
import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractTable } from "./AbstractTable";
import { AbstractPipeline } from "./AbstractPipeline";
import { AbstractPipelineTask } from "./AbstractPipelineTask";
import { TableFactory } from "./TableFactory";
import { ServiceComment } from "./ServiceComment";

export class TaskInsights {

    public static readonly NUMBER_PIPELINES_FOR_HEALTH = 3;
    public static readonly NUMBER_PIPELINES_FOR_LONG_RUNNING_VALIDATIONS = 50;
    public static readonly MINIMUM_SECONDS = 1;

    private data: PipelineData;
    private azureApi: AbstractAzureApi;
    private currentPipeline: AbstractPipeline;
    private targetBranch: Branch;
    private pullRequest: PullRequest;
    private longRunningValidations: AbstractPipelineTask[];
    private thresholdTimes: number[];

    constructor(data: PipelineData) {
        this.data = data;
    }

    public async invoke(): Promise<void> {
        this.azureApi = await AzureApiFactory.create(this.data);
        this.pullRequest = await this.azureApi.getPullRequest(this.data.getRepository(), this.data.getPullRequestId(), this.data.getProjectName());

        if (this.taskIsRunningInMostRecentSourceCommit()) {
            this.currentPipeline = await this.azureApi.getCurrentPipeline(this.data);
            tl.debug("target branch of pull request: " + this.pullRequest.getTargetBranchName());
            this.targetBranch = new Branch(this.pullRequest.getTargetBranchName());
            this.targetBranch.setPipelines(await this.azureApi.getMostRecentPipelinesOfCurrentType(this.data.getProjectName(), this.currentPipeline, TaskInsights.NUMBER_PIPELINES_FOR_HEALTH, this.targetBranch.getFullName()));
            let tableType: string = TableFactory.FAILURE;
            tl.debug("pipeline is a failure?: " + this.currentPipeline.isFailure());
            tl.debug("host type: " + this.data.getHostType())
            if (!this.currentPipeline.isFailure()) {
                tableType = TableFactory.LONG_RUNNING_VALIDATIONS;
                await this.findAllLongRunningValidations();
            }
            if (this.shouldPRInsightsCommentOccur()) {
                tl.debug("PR Insights should manage comments = true");
                this.manageComments(tableType);
            }
        }
        else {
            tl.debug(this.data.getHostType() + " is not for most recent source commit");
        }
    }

    private taskIsRunningInMostRecentSourceCommit(): boolean {
        return this.pullRequest.getMostRecentSourceCommitId() === this.data.getCurrentSourceCommitIteration();
    }

    private async checkStatusLink(currentStatusLink: string, project: string): Promise<string> {
        if (!currentStatusLink) {
            currentStatusLink = await this.currentPipeline.getDefinitionLink(this.azureApi, project);
        }
        tl.debug(`Check status link to use: ${currentStatusLink}`);
        return currentStatusLink;
    }

    private async findAllLongRunningValidations(): Promise<void> {
        this.longRunningValidations = [];
        this.thresholdTimes = [];
        this.targetBranch.setPipelines(await this.azureApi.getMostRecentPipelinesOfCurrentType(this.data.getProjectName(), this.currentPipeline, TaskInsights.NUMBER_PIPELINES_FOR_LONG_RUNNING_VALIDATIONS, this.targetBranch.getFullName()));
        for (let task of this.currentPipeline.getTasks()) {
            let thresholdTime: number = this.targetBranch.getPercentileTimeForPipelineTask(this.data.getDurationPercentile(), task);
            if (this.shouldTaskBeAddedToLongRunningValidations(task, thresholdTime)) {
                this.longRunningValidations.push(task);
                this.thresholdTimes.push(thresholdTime);
            }
        }
        tl.debug("Number of longRunningValidations = " + this.longRunningValidations.length);
    }

    private shouldTaskBeAddedToLongRunningValidations(task: AbstractPipelineTask, thresholdTime: number): boolean {
        return task.isLongRunning(thresholdTime, TaskInsights.getMillisecondsFromSeconds(this.data.getMimimumValidationDurationSeconds()), TaskInsights.getMillisecondsFromSeconds(this.data.getMimimumValidationRegressionSeconds())) &&
            this.data.getTaskTypesForLongRunningValidations().includes(task.getType());
    }

    private async manageComments(tableType: string): Promise<void> {
        let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await this.pullRequest.getCurrentServiceCommentThreads(this.azureApi);
        let serviceComment: ServiceComment = this.pullRequest.makeCurrentIterationComment(serviceThreads);
        serviceComment.formatNewData(tableType, this.currentPipeline, await this.checkStatusLink(this.data.getStatusLink(), this.data.getProjectName()), this.targetBranch, this.longRunningValidations, this.thresholdTimes)
        if (this.pullRequest.hasServiceThreadForExistingIteration(serviceThreads)) {
            this.pullRequest.editServiceComment(this.azureApi, serviceComment);
        }
        else {
            let currentIterationCommentThreadId: number = (await this.pullRequest.postNewThread(this.azureApi, serviceComment.getContent(), azureGitInterfaces.CommentThreadStatus.Closed)).id;
            this.pullRequest.deleteOldComments(this.azureApi, serviceThreads, currentIterationCommentThreadId);
        }
    }

    private shouldPRInsightsCommentOccur(): boolean {
        return this.currentPipeline.isFailure() || (this.longRunningValidations.length > 0 && this.data.isLongRunningValidationFeatureEnabled());
    }

    public static getMillisecondsFromSeconds(seconds: number): number {
        if (seconds < this.MINIMUM_SECONDS) {
            seconds = this.MINIMUM_SECONDS;
        }
        return seconds * 1000;
    }
}