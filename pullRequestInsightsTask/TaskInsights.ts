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

export class TaskInsights {

    private static readonly numberPipelinesToConsiderForHealth = 3;
    private static readonly numberPipelinesToConsiderForLongRunningValidations = 50;

    private data: PipelineData;
    private azureApi: AbstractAzureApi;
    private currentPipeline: AbstractPipeline;
    private targetBranch: Branch;
    private pullRequest: PullRequest;
    private longRunningValidations: AbstractPipelineTask[];
    private thresholdTimes: number[];
    private table: AbstractTable;

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
            this.targetBranch.setPipelines(await this.azureApi.getMostRecentPipelinesOfCurrentType(this.data.getProjectName(), this.currentPipeline, TaskInsights.numberPipelinesToConsiderForHealth, this.targetBranch.getFullName()));
    
            let tableType: string = TableFactory.FAILURE;
            tl.debug("pipeline is a failure?: " + this.currentPipeline.isFailure());
            tl.debug("host type: " + this.data.getHostType())

            if (!this.currentPipeline.isFailure()) {
                tableType = TableFactory.LONG_RUNNING_VALIDATIONS;
                this.findAllLongRunningValidations();
            }

            if (this.shouldPRInsightsCommentOccur()) {
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
        this.targetBranch.setPipelines(await this.azureApi.getMostRecentPipelinesOfCurrentType(this.data.getProjectName(), this.currentPipeline, TaskInsights.numberPipelinesToConsiderForLongRunningValidations, this.targetBranch.getFullName()));
        for (let task of this.currentPipeline.getTasks()) {
            let percentileTime: number = this.targetBranch.getPercentileTimeForPipelineTask(this.data.getDurationPercentile(), task);
            if (this.shouldTaskBeAddedToLongRunningValidations(task)) {
                this.longRunningValidations.push(task);
                this.thresholdTimes.push(percentileTime);
            }
        }
        tl.debug("Number of longRunningValidations = " + this.longRunningValidations.length);
    }
    
    private shouldTaskBeAddedToLongRunningValidations(task: AbstractPipelineTask): boolean {
        return task.isLongRunning(this.data.getDurationPercentile(), TaskInsights.getMillisecondsFromMinutes(this.data.getMimimumValidationDurationMinutes()), TaskInsights.getMillisecondsFromMinutes(this.data.getMimimumValidationRegressionMinutes())) && 
        this.data.getTaskTypesForLongRunningValidations().includes(task.getType());
    }

    private makeTable(tableType: string, checkStatusLink: string, currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread) {
        tl.debug("type of table to create: " + tableType);
        let table: AbstractTable = TableFactory.create(tableType, this.pullRequest.getCurrentIterationCommentContent(currentIterationCommentThread));
        tl.debug("comment data: " + table.getCurrentCommentData());
        table.addHeader(this.targetBranch.getTruncatedName());
        table.addSection(this.currentPipeline, checkStatusLink, this.targetBranch, TaskInsights.numberPipelinesToConsiderForHealth, this.longRunningValidations, this.thresholdTimes);
    }

    private async manageComments(tableType: string): Promise<void> {
        let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await this.pullRequest.getCurrentServiceCommentThreads(this.azureApi);
        let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = this.pullRequest.getCurrentIterationCommentThread(serviceThreads);
        this.makeTable(tableType, await this.checkStatusLink(this.data.getStatusLink(), this.data.getProjectName()), currentIterationCommentThread);
        if (currentIterationCommentThread) {
            this.pullRequest.editCommentInThread(this.azureApi, currentIterationCommentThread, currentIterationCommentThread.comments[0].id, this.table.getCurrentCommentData());
        }
        else {
            let currentIterationCommentThreadId: number = (await this.pullRequest.addNewComment(this.azureApi, this.table.getCurrentCommentData(), azureGitInterfaces.CommentThreadStatus.Closed)).id;
            this.pullRequest.deleteOldComments(this.azureApi, serviceThreads, currentIterationCommentThreadId);
        }
    }

    private shouldPRInsightsCommentOccur(): boolean {
      return this.currentPipeline.isFailure() || (this.longRunningValidations.length > 0 && this.data.isLongRunningValidationFeatureEnabled());
    }


    public static getMillisecondsFromMinutes(minutes: number): number {
        return minutes * 60000;
    }
}