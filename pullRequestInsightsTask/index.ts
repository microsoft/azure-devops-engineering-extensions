import tl = require('azure-pipelines-task-lib/task');
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
import messages from './user_messages.json';
import { Branch } from './Branch';
import { AbstractPipeline } from './AbstractPipeline';
import { AzureApiFactory } from './AzureApiFactory';
import { PullRequest } from './PullRequest';
import './StringExtensions';
import { AbstractPipelineTask } from './AbstractPipelineTask';
import { AbstractAzureApi } from './AbstractAzureApi';
import { Table } from './Table';
import { TableFactory } from './TableFactory';
import './StringExtensions';
import { PipelineData } from './PipelineData';
import { TaskInsights } from './TaskInsights';

async function run() {
    try {
        const percentile: number = 1; 
        const numberBuildsToQuery: number = 10;
        const numberPipelinesToConsiderForHealth = 3;

        let environmentConfigurations: EnvironmentConfigurations = new EnvironmentConfigurations();
        let data: PipelineData = new PipelineData();
        data.setAccessKey(environmentConfigurations.getAccessKey());
        data.setCurrentSourceCommitIteration(environmentConfigurations.getValue(EnvironmentConfigurations.SOURCE_COMMIT_ITERATION_KEY));
        data.setHostType(environmentConfigurations.getValue(EnvironmentConfigurations.HOST_KEY));
        data.setProjectName(environmentConfigurations.getValue(EnvironmentConfigurations.PROJECT_KEY));
        data.setReleaseId(Number(environmentConfigurations.getValue(EnvironmentConfigurations.RELEASE_ID_KEY)));
        data.setBuildId(Number(environmentConfigurations.getValue(EnvironmentConfigurations.BUILD_ID_KEY)));
        data.setRepository(environmentConfigurations.getValue(EnvironmentConfigurations.REPOSITORY_KEY));
        data.setTeamUri(environmentConfigurations.getValue(EnvironmentConfigurations.TEAM_FOUNDATION_KEY));
        data.setPullRequestId(environmentConfigurations.getPullRequestId());
        tl.debug("pipline data: " + JSON.stringify(data));


        if (!data.getPullRequestId()) {
            tl.debug(messages.notInPullRequestMessage);
        }
        else {

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
                let checkStatusLink: string = await getStatusLink(currentPipeline, azureApi, data.getProjectName());
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
    }
    catch (err) {
        console.log("error!", err); 
    }
}


run();