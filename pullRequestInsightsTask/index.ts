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

async function run() {
    try {
        const percentile: number = 95; 
        const numberBuildsToQuery: number = 10;
        let configurations: EnvironmentConfigurations = new EnvironmentConfigurations();

        tl.debug("pull request id: " + configurations.getPullRequestId());
        if (!configurations.getPullRequestId()){
            tl.debug(messages.notInPullRequestMessage);
        }
        else {
            let azureApiFactory: AzureApiFactory = new AzureApiFactory();
            let azureApi = await azureApiFactory.create(configurations); 
            let currentProject: string = configurations.getProjectName();
            let currentPipeline: IPipeline = await azureApi.getCurrentPipeline(configurations);
            let type: string = configurations.getHostType();
            let commentFactory: CommentContentFactory = new CommentContentFactory();
            let pullRequest: PullRequest = new PullRequest(configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName());
            let targetBranchName: string = await configurations.getTargetBranch(azureApi);
            tl.debug("target branch of pull request: " + targetBranchName);
            let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(currentProject, currentPipeline, numberBuildsToQuery, targetBranchName);
            tl.debug(`Number of retrieved pipelines for ${targetBranchName} = ` + retrievedPipelines.length);
            let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines); 
            let thresholdTimes: Map<string, number> = new Map();
            let longRunningValidations: Map<string, number> = new Map();
            
            if (!currentPipeline.isFailure()){
                thresholdTimes = targetBranch.getPercentileTimesForPipelineTasks(percentile, currentPipeline.getTaskIds());
                longRunningValidations = currentPipeline.getLongRunningValidations(thresholdTimes);
                tl.debug("Number of longRunningValidations = " + longRunningValidations.size);
                for (let taskId of Array.from(longRunningValidations.keys())) {
                    tl.debug("long running validation: " + taskId);
                }
            }
            if (currentPipeline.isFailure() || longRunningValidations.size > 0) {
                let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await pullRequest.getCurrentServiceComments(azureApi);
                let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = await pullRequest.getCurrentIterationCommentThread(serviceThreads, configurations.getBuildIteration());
                let currentPipelineCommentContent: string = commentFactory.createTableSection(currentPipeline, targetBranch.getMostRecentCompletePipeline(), targetBranch, type, longRunningValidations, thresholdTimes);
                if (currentIterationCommentThread) {
                    pullRequest.editMatchingCommentInThread(azureApi, currentIterationCommentThread, currentPipelineCommentContent, configurations.getBuildIteration());
                }
                else {
                    currentPipelineCommentContent = commentFactory.createIterationHeader(configurations.getBuildIteration()) + "\n" + commentFactory.createTableHeader(currentPipeline.isFailure(), targetBranch.getTruncatedName(), String(percentile)) + "\n" + currentPipelineCommentContent;
                    let currentIterationCommentThreadId: number = (await pullRequest.addNewComment(azureApi, currentPipelineCommentContent, configurations.getBuildIteration())).id;
                    pullRequest.deactivateOldComments(azureApi, serviceThreads, currentIterationCommentThreadId);
                }
            }   
        }
    }
    catch (err) {
        console.log("error!", err); 
    }
}

run();