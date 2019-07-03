import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
import messages from './user_messages.json';
import { Branch } from './Branch';
import { IPipeline } from './IPipeline';
import { AzureApiFactory } from './AzureApiFactory';
import { PullRequest } from './PullRequest';
import './StringExtensions';
import { CommentContentFactory } from './CommentContentFactory';
import { AbstractPipelineTask } from './AbstractPipelineTask';
import { AbstractAzureApi } from './AbstractAzureApi';
import { Table } from './Table';
import { TableFactory } from './TableFactory';

async function run() {
    try {
        const percentile: number = 1; 
        const numberBuildsToQuery: number = 10;
        const numberPipelinesToConsiderForHealth = 3;
        let configurations: EnvironmentConfigurations = new EnvironmentConfigurations();

        tl.debug("pull request id: " + configurations.getPullRequestId());
        if (!configurations.getPullRequestId()) {
            tl.debug(messages.notInPullRequestMessage);
        }
        else {
            let azureApiFactory: AzureApiFactory = new AzureApiFactory();
            let azureApi = await azureApiFactory.create(configurations);
           // let currentProject: string = configurations.getProjectName();
            let currentPipeline: IPipeline = await azureApi.getCurrentPipeline(configurations);
            //let commentFactory: CommentContentFactory = new CommentContentFactory();
            let pullRequest: PullRequest = await azureApi.getPullRequest(configurations.getRepository(), configurations.getPullRequestId(), configurations.getProjectName());
            let targetBranchName: string = pullRequest.getTargetBranchName();
            tl.debug("target branch of pull request: " + targetBranchName);
            let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(configurations.getProjectName(), currentPipeline, numberBuildsToQuery, targetBranchName);
            tl.debug(`Number of retrieved pipelines for ${targetBranchName} = ` + retrievedPipelines.length);
            let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines);
            let thresholdTimes: number[] = [];
            let longRunningValidations: AbstractPipelineTask[] = [];
            let tableType: string = TableFactory.FAILURE;
            tl.debug("pipeline is a failure?: " + currentPipeline.isFailure());
            tl.debug("host type: " + configurations.getHostType())

            if (!currentPipeline.isFailure() && configurations.getHostType() === "build") { // temporary second condition, present since long running validations only functional for builds as of now
                tableType = TableFactory.LONG_RUNNING_VALIDATIONS;
                for (let task of currentPipeline.getAllTasks()) {
                    let percentileTime: number = targetBranch.getPercentileTimeForPipelineTask(percentile, task);
                    if (task.isLongRunning(percentileTime)) {
                        longRunningValidations.push(task);
                        thresholdTimes.push(percentileTime);
                    }
                }
                tl.debug("Number of longRunningValidations = " + longRunningValidations.length);
            }

            if (pullRequest.mostRecentSourceCommitMatchesCurrent(configurations.getCurrentSourceCommitIteration()) && (currentPipeline.isFailure() || longRunningValidations.length > 0)) {
                let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await pullRequest.getCurrentServiceCommentThreads(azureApi);
                let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = pullRequest.getCurrentIterationCommentThread(serviceThreads);
                let checkStatusLink: string = await getStatusLink(currentPipeline, azureApi, configurations.getProjectName());
                tl.debug(`Check status link to use: ${checkStatusLink}`);
                tl.debug("type of table to create: " + tableType);
                let table: Table = TableFactory.create(tableType, pullRequest.getCurrentIterationCommentContent(currentIterationCommentThread)); 
                tl.debug("table is null?: " + String(table == null));
                tl.debug("comment data: " + table.getCurrentCommentData);
                table.addHeader(targetBranch.getTruncatedName(), percentile);
                table.addSection(currentPipeline, checkStatusLink, targetBranch, numberPipelinesToConsiderForHealth, longRunningValidations, thresholdTimes)
                if (currentIterationCommentThread) {
                    pullRequest.editCommentInThread(azureApi, currentIterationCommentThread, currentIterationCommentThread.comments[0].id, table.getCurrentCommentData());
                }
                else {
                   // currentPipelineCommentContent = messages.summaryLine + "\n" + commentFactory.createTableHeader(currentPipeline.isFailure(), targetBranch.getTruncatedName(), String(percentile)) + "\n" + currentPipelineCommentContent;
                    let currentIterationCommentThreadId: number = (await pullRequest.addNewComment(azureApi, table.getCurrentCommentData(), azureGitInterfaces.CommentThreadStatus.Closed)).id;
                    pullRequest.deleteOldComments(azureApi, serviceThreads, currentIterationCommentThreadId);
                }
                
            }
        }
    }
    catch (err) {
        console.log("error!", err); 
    }
}

async function getStatusLink(currentPipeline: IPipeline, apiCaller: AbstractAzureApi, project: string): Promise<string> {
    let statusLink: string = tl.getInput("checkStatusLink", false);
    if (!statusLink) {
       statusLink = await currentPipeline.getDefinitionLink(apiCaller, project);
    }
    return statusLink;
}

run();