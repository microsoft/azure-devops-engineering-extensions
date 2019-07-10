import { PipelineData } from "./PipelineData";
import { AzureApiFactory } from "./AzureApiFactory";
import { Branch } from "./Branch";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { PullRequest } from "./PullRequest";
import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { Table } from "./Table";
import { AbstractPipeline } from "./AbstractPipeline";
import { AbstractPipelineTask } from "./AbstractPipelineTask";
import { TableFactory } from "./TableFactory";




export class TaskInsights {

    public async invoke(data: PipelineData): Promise<void> {

        const numberPipelinesToConsiderForHealth = 3;
        const numberPipelinesToConsiderForLongRunningValidations = 50;
       
        let azureApi = await AzureApiFactory.create(data)
        let pullRequest: PullRequest = await azureApi.getPullRequest(data.getRepository(), data.getPullRequestId(), data.getProjectName());

        if (pullRequest.mostRecentSourceCommitMatchesCurrent(data.getCurrentSourceCommitIteration())) {
            let currentPipeline: AbstractPipeline = await azureApi.getCurrentPipeline(data);
            tl.debug("target branch of pull request: " + pullRequest.getTargetBranchName());            
            let targetBranch: Branch = new Branch(pullRequest.getTargetBranchName());
            targetBranch.setPipelines(await azureApi.getMostRecentPipelinesOfCurrentType(data.getProjectName(), currentPipeline, numberPipelinesToConsiderForHealth, targetBranch.getFullName()));
            let thresholdTimes: number[] = [];
            let longRunningValidations: AbstractPipelineTask[] = [];
            let tableType: string = TableFactory.FAILURE;
            tl.debug("pipeline is a failure?: " + currentPipeline.isFailure());
            tl.debug("host type: " + data.getHostType())

            if (!currentPipeline.isFailure()) {
                tableType = TableFactory.LONG_RUNNING_VALIDATIONS;
                targetBranch.setPipelines(await azureApi.getMostRecentPipelinesOfCurrentType(data.getProjectName(), currentPipeline, numberPipelinesToConsiderForLongRunningValidations, targetBranch.getFullName()));
                for (let task of currentPipeline.getTasks()) {
                    let percentileTime: number = targetBranch.getPercentileTimeForPipelineTask(data.getDurationPercentile(), task);
                    if (task.isLongRunning(percentileTime, TaskInsights.getMillisecondsFromMinutes(data.getMimimumValidationDurationMinutes()), TaskInsights.getMillisecondsFromMinutes(data.getMimimumValidationRegressionMinutes())) && 
                    data.getTaskTypesForLongRunningValidations().includes(task.getType())) {
                        longRunningValidations.push(task);
                        thresholdTimes.push(percentileTime);
                    }
                }
                tl.debug("Number of longRunningValidations = " + longRunningValidations.length);
            }

            if ((currentPipeline.isFailure() || longRunningValidations.length > 0)) {
                let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await pullRequest.getCurrentServiceCommentThreads(azureApi);
                let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = pullRequest.getCurrentIterationCommentThread(serviceThreads);
                let checkStatusLink: string = await this.getStatusLink(currentPipeline, azureApi, data.getProjectName());
                tl.debug(`Check status link to use: ${checkStatusLink}`);
                tl.debug("type of table to create: " + tableType);
                let table: Table = TableFactory.create(tableType, pullRequest.getCurrentIterationCommentContent(currentIterationCommentThread));
                tl.debug("comment data: " + table.getCurrentCommentData());
                table.addHeader(targetBranch.getTruncatedName());
                table.addSection(currentPipeline, checkStatusLink, targetBranch, numberPipelinesToConsiderForHealth, longRunningValidations, thresholdTimes)
                if (currentIterationCommentThread) {
                    pullRequest.editCommentInThread(azureApi, currentIterationCommentThread, currentIterationCommentThread.comments[0].id, table.getCurrentCommentData());
                }
                else {
                    let currentIterationCommentThreadId: number = (await pullRequest.addNewComment(azureApi, table.getCurrentCommentData(), azureGitInterfaces.CommentThreadStatus.Closed)).id;
                    pullRequest.deleteOldComments(azureApi, serviceThreads, currentIterationCommentThreadId);
                }

            }
        }
        else {
            tl.debug(data.getHostType() + " is not for most recent source commit");
        }
    }

    private async getStatusLink(currentPipeline: AbstractPipeline, apiCaller: AbstractAzureApi, project: string): Promise<string> {
        let statusLink: string = tl.getInput("checkStatusLink", false);
        if (!statusLink) {
            statusLink = await currentPipeline.getDefinitionLink(apiCaller, project);
        }
        return statusLink;
    }

    public static getMillisecondsFromMinutes(minutes: number) {
        return minutes * 60000;
    }
}