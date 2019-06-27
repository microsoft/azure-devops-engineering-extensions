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
import { IPipelineTask } from './IPipelineTask';
import { RapidCommentTest } from './RapidCommentTest';

async function run() {
    try {
        const percentile: number = 1000; 
        const numberBuildsToQuery: number = 10;
        let configurations: EnvironmentConfigurations = new EnvironmentConfigurations();

        tl.debug("pull request id: " + configurations.getPullRequestId());
        if (!configurations.getPullRequestId()) {
            tl.debug(messages.notInPullRequestMessage);
        }
        else {
           // let supportLink: string = tl.getInput('SupportContactLink', true);
            let azureApiFactory: AzureApiFactory = new AzureApiFactory();
            let azureApi = await azureApiFactory.create(configurations);
            let currentProject: string = configurations.getProjectName();
            let currentPipeline: IPipeline = await azureApi.getCurrentPipeline(configurations);
            let commentFactory: CommentContentFactory = new CommentContentFactory();
            let pullRequest: PullRequest = new PullRequest(configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName());

            // let rapid: RapidCommentTest = new RapidCommentTest(azureApi);
            // rapid.test();

            let targetBranchName: string = await configurations.getTargetBranch(azureApi);
            tl.debug("target branch of pull request: " + targetBranchName);
            let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(configurations.getProjectName(), currentPipeline, numberBuildsToQuery, targetBranchName);
            tl.debug(`Number of retrieved pipelines for ${targetBranchName} = ` + retrievedPipelines.length);
            let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines);
            let thresholdTimes: number[] = [];
            let longRunningValidations: IPipelineTask[] = [];

            if (!currentPipeline.isFailure() && type === "build") { // temporary second condition, present since long running validations only functional for builds as of now
                for (let task of currentPipeline.getAllTasks()) {
                    let percentileTime: number = targetBranch.getPercentileTimeForPipelineTask(percentile, task);
                    if (task.isLongRunning(percentileTime)) {
                        longRunningValidations.push(task);
                        thresholdTimes.push(percentileTime);
                    }
                }
                tl.debug("Number of longRunningValidations = " + longRunningValidations.length);
            }
            if (currentPipeline.isFailure() || longRunningValidations.length > 0) {
                let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await pullRequest.getCurrentServiceCommentThreads(azureApi);
                let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = pullRequest.getCurrentIterationCommentThread(serviceThreads, configurations.getSourceCommitIteration());
                let definitionLink: string = await currentPipeline.getDefinitionLink(azureApi, configurations.getProjectName());
                let currentPipelineCommentContent: string = commentFactory.createTableSection(currentPipeline, definitionLink, targetBranch.getMostRecentCompletePipeline(), targetBranch, longRunningValidations, thresholdTimes);
                if (currentIterationCommentThread) {
                    pullRequest.editCommentInThread(azureApi, currentIterationCommentThread, currentIterationCommentThread.comments[0].id, "\n" + currentPipelineCommentContent);
                }
                else {
                    currentPipelineCommentContent = commentFactory.createTableHeader(currentPipeline.isFailure(), targetBranch.getTruncatedName(), String(percentile)) + "\n" + currentPipelineCommentContent;
                    let currentIterationCommentThreadId: number = (await pullRequest.addNewComment(azureApi, currentPipelineCommentContent, configurations.getSourceCommitIteration())).id;
                    // pullRequest.deactivateOldComments(azureApi, serviceThreads, currentIterationCommentThreadId);
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