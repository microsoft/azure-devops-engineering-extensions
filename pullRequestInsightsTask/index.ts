import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
let fs = require('fs');
import messages from './user_messages.json';
import { Branch } from './Branch';
import { IPipeline } from './IPipeline';
import { AzureApiFactory } from './AzureApiFactory';
import { AbstractAzureApi } from './AbstractAzureApi';
import { PullRequest } from './PullRequest';


async function run() {
    try {
        tl.debug("starting!")
        const pastFailureThreshold: number = 2; 
        const numberBuildsToQuery: number = 10;
        
        let configurations: EnvironmentConfigurations = new EnvironmentConfigurations();
        let azureApiFactory: AzureApiFactory = new AzureApiFactory();
        let azureApi = await azureApiFactory.create(configurations); 
        let currentProject: string = configurations.getProjectName();
        let currentPipeline: IPipeline = await azureApi.getCurrentPipeline(configurations);

        tl.debug("pull request id: " + configurations.getPullRequestId());
        if (!configurations.getPullRequestId()){
            tl.debug(this.format(messages.notInPullRequestMessage, configurations.getHostType()));
        }
        else if (!currentPipeline.isFailure()){
            tl.debug(this.format(messages.noFailureMessage, configurations.getHostType()));
        }
        else {
            let pullRequest: PullRequest = new PullRequest(configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName());
            tl.debug("past checks to see if task should run");
            let targetBranchName: string = await configurations.getTargetBranch(azureApi);
            tl.debug("target branch: " + targetBranchName);
            let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(currentProject, currentPipeline, numberBuildsToQuery, targetBranchName);
            tl.debug("past retrieving pipelines and got: " + retrievedPipelines.length + " pipelines");
            let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines); 
            tl.debug("past making target branch")
            if (targetBranch.tooManyPipelinesFailed(pastFailureThreshold)){
                tl.debug("too many failures = true");
                let currentIterationCommentThread: azureGitInterfaces.GitPullRequestCommentThread = await pullRequest.getCurrentIterationCommentThread(azureApi, configurations.getBuildIteration());
                let currentIterationCommentThreadId: number;
                if (currentIterationCommentThread) {
                    currentIterationCommentThreadId = currentIterationCommentThread.id;
                    pullRequest.editCommentThread(azureApi, currentIterationCommentThread);
                }
                else {
                    currentIterationCommentThreadId = (await pullRequest.addNewComment(azureApi, "")).id;
                }
                pullRequest.deactivateOldComments(azureApi, currentIterationCommentThreadId);
            }
        }   
    }
    catch (err) {
        console.log("error!", err); 
    }
}

// async function postFailuresComment(azureApi: AbstractAzureApi, currentPipeline: IPipeline, targetBranch: Branch, configurations: EnvironmentConfigurations, currentPullRequest: PullRequest): Promise<void> {
//     let mostRecentTargetFailedPipeline = targetBranch.getMostRecentFailedPipeline();
//     if (mostRecentTargetFailedPipeline !== null){
//        await currentPullRequest.manageFailureComments(azureApi, configurations.getBuildIteration());
//        let commentContent: string = format(messages.failureCommentHeading,  configurations.getBuildIteration()) + format(messages.failureCommentRow, currentPipeline.getName(), currentPipeline.getLink(), String(targetBranch.getPipelineFailStreak()),  targetBranch.getTruncatedName(), configurations.getHostType(), targetBranch.getTruncatedName(), mostRecentTargetFailedPipeline.getName(), mostRecentTargetFailedPipeline.getLink());
//        let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: commentContent})};
//        //let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: format(messages.failureComment, configurations.getBuildIteration(), currentPipeline.getName(), currentPipeline.getLink(), String(targetBranch.getPipelineFailStreak()),  targetBranch.getTruncatedName(), configurations.getHostType(), targetBranch.getTruncatedName(), mostRecentTargetFailedPipeline.getName(), mostRecentTargetFailedPipeline.getLink())})};
//       // azureApi.postNewCommentThread(thread, configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName());
//        tl.debug(messages.commentCompletedMessage);
//     }
// }

run();