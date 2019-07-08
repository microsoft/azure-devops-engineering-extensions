import { PipelineData } from "./PipelineData";
import { AzureApiFactory } from "./AzureApiFactory";
import { IPipeline } from "./IPipeline";
import { CommentContentFactory } from "./CommentContentFactory";
import { Branch } from "./Branch";
import { IPipelineTask } from "./IPipelineTask";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { PullRequest } from "./PullRequest";
import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import messages from "./user_messages.json";




export class TaskInsights {

public async invoke(data: PipelineData): Promise<void> {
    tl.debug("start of invoke")

    const percentile: number = 1000; 
    const numberBuildsToQuery: number = 10;
    const numberPipelinesToConsiderForHealth = 3;

    let azureApiFactory: AzureApiFactory = new AzureApiFactory();
    let azureApi = await azureApiFactory.create(data);
    tl.debug("azure api created");
    let currentPipeline: IPipeline = await azureApi.getCurrentPipeline(data);
    tl.debug("current pipeline fetched");
    let commentFactory: CommentContentFactory = new CommentContentFactory();
    let pullRequest: PullRequest = await azureApi.getPullRequest(data.getRepository(), data.getPullRequestId(), data.getProjectName());
    let targetBranchName: string = pullRequest.getTargetBranchName();
    tl.debug("target branch of pull request: " + targetBranchName);
    let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(data.getProjectName(), currentPipeline, numberBuildsToQuery, targetBranchName);
    tl.debug(`Number of retrieved pipelines for ${targetBranchName} = ` + retrievedPipelines.length);
    let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines);
    let thresholdTimes: number[] = [];
    let longRunningValidations: IPipelineTask[] = [];

    // if (!currentPipeline.isFailure() && type === "build") { // temporary second condition, present since long running validations only functional for builds as of now
    //     for (let task of currentPipeline.getAllTasks()) {
    //         let percentileTime: number = targetBranch.getPercentileTimeForPipelineTask(percentile, task);
    //         if (task.isLongRunning(percentileTime)) {
    //             longRunningValidations.push(task);
    //             thresholdTimes.push(percentileTime);
    //         }
    //     }
    //     tl.debug("Number of longRunningValidations = " + longRunningValidations.length);
    // }

    if (pullRequest.mostRecentSourceCommitMatchesCurrent(data.getCurrentSourceCommitIteration()) && (currentPipeline.isFailure() || longRunningValidations.length > 0)) {
        let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await pullRequest.getCurrentServiceCommentThreads(azureApi);
        let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = pullRequest.getCurrentIterationCommentThread(serviceThreads);
        let checkStatusLink: string = await this.getStatusLink(currentPipeline, azureApi, data.getProjectName());
        tl.debug(`Check status link to use: ${checkStatusLink}`);
        let currentPipelineCommentContent: string = commentFactory.createTableSection(currentPipeline, checkStatusLink, targetBranch.getMostRecentCompletePipeline(), targetBranch, numberPipelinesToConsiderForHealth, longRunningValidations, thresholdTimes);
        if (currentIterationCommentThread) {
            pullRequest.editCommentInThread(azureApi, currentIterationCommentThread, currentIterationCommentThread.comments[0].id, "\n" + currentPipelineCommentContent);
        }
        else {
            currentPipelineCommentContent = messages.summaryLine + "\n" + commentFactory.createTableHeader(currentPipeline.isFailure(), targetBranch.getTruncatedName(), String(percentile)) + "\n" + currentPipelineCommentContent;
            let currentIterationCommentThreadId: number = (await pullRequest.addNewComment(azureApi, currentPipelineCommentContent, azureGitInterfaces.CommentThreadStatus.Closed)).id;
            pullRequest.deleteOldComments(azureApi, serviceThreads, currentIterationCommentThreadId);
        }
    }
}

private async getStatusLink(currentPipeline: IPipeline, apiCaller: AbstractAzureApi, project: string): Promise<string> {
    let statusLink: string = tl.getInput("checkStatusLink", false);
    if (!statusLink) {
       statusLink = await currentPipeline.getDefinitionLink(apiCaller, project);
    }
    return statusLink;
}
}