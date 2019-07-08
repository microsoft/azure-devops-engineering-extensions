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

    const percentile: number = 1; 
    const numberBuildsToQuery: number = 10;
    const numberPipelinesToConsiderForHealth = 3;

    
    let azureApiFactory: AzureApiFactory = new AzureApiFactory();
    let azureApi = await azureApiFactory.create(data)
    let currentPipeline: AbstractPipeline = await azureApi.getCurrentPipeline(data);
    let pullRequest: PullRequest = await azureApi.getPullRequest(data.getRepository(), data.getPullRequestId(), data.getProjectName());
    let targetBranchName: string = pullRequest.getTargetBranchName();
    tl.debug("target branch of pull request: " + targetBranchName);
    let retrievedPipelines: AbstractPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(data.getProjectName(), currentPipeline, numberBuildsToQuery, targetBranchName);
    tl.debug(`Number of retrieved pipelines for ${targetBranchName} = ` + retrievedPipelines.length);
    let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines);
    let thresholdTimes: number[] = [];
    let longRunningValidations: AbstractPipelineTask[] = [];
    let tableType: string = TableFactory.FAILURE;
    tl.debug("pipeline is a failure?: " + currentPipeline.isFailure());
    tl.debug("host type: " + data.getHostType())

    if (!currentPipeline.isFailure()) { 
        tableType = TableFactory.LONG_RUNNING_VALIDATIONS;
        for (let task of currentPipeline.getTasks()) {
            let percentileTime: number = targetBranch.getPercentileTimeForPipelineTask(percentile, task);
            if (task.isLongRunning(percentileTime)) {
                longRunningValidations.push(task);
                thresholdTimes.push(percentileTime);
            }
        }
        tl.debug("Number of longRunningValidations = " + longRunningValidations.length);
    }

    if (pullRequest.mostRecentSourceCommitMatchesCurrent(data.getCurrentSourceCommitIteration()) && (currentPipeline.isFailure() || longRunningValidations.length > 0)) {
        let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await pullRequest.getCurrentServiceCommentThreads(azureApi);
        let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = pullRequest.getCurrentIterationCommentThread(serviceThreads);
        let checkStatusLink: string = await this.getStatusLink(currentPipeline, azureApi, data.getProjectName());
        tl.debug(`Check status link to use: ${checkStatusLink}`);
        tl.debug("type of table to create: " + tableType);
        let table: Table = TableFactory.create(tableType, pullRequest.getCurrentIterationCommentContent(currentIterationCommentThread)); 
        tl.debug("comment data: " + table.getCurrentCommentData());
        table.addHeader(targetBranch.getTruncatedName(), percentile);
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

private async getStatusLink(currentPipeline: AbstractPipeline, apiCaller: AbstractAzureApi, project: string): Promise<string> {
    let statusLink: string = tl.getInput("checkStatusLink", false);
    if (!statusLink) {
       statusLink = await currentPipeline.getDefinitionLink(apiCaller, project);
    }
    return statusLink;
}
}