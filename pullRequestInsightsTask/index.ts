import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
let fs = require('fs');
import messages from './user_messages.json';
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Branch } from './Branch';
import { IPipeline } from './IPipeline';
import { AzureApiFactory } from './AzureApiFactory';
import { AbstractAzureApi } from './AbstractAzureApi';

async function run() {
    try {
        tl.debug("starting!")
        const pastFailureThreshold: number = 2; 
        const numberBuildsToQuery: number = 10;
        const desiredBuildReasons: number = azureBuildInterfaces.BuildReason.BatchedCI + azureBuildInterfaces.BuildReason.IndividualCI;
        const desiredBuildStatus: number = azureBuildInterfaces.BuildStatus.Completed;
        let configurations: EnvironmentConfigurations = new EnvironmentConfigurations();
        let azureApiFactory: AzureApiFactory = new AzureApiFactory();
        //let azureApi: AzureApi = new AzureApi(configurations.getTeamURI(), configurations.getAccessKey());
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
            tl.debug("past checks to see if task should run")
            let targetBranchName: string = await configurations.getTargetBranch(azureApi);
            tl.debug("target branch: " + targetBranchName);
            let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(currentProject, currentPipeline.getDefinitionId(), desiredBuildReasons, desiredBuildStatus, numberBuildsToQuery, targetBranchName);
            tl.debug("past retrieving pipelines");
            let targetBranch: Branch = new Branch(targetBranchName, retrievedPipelines); //convertBuildData(retrievedBuilds));
            tl.debug("past making target branch")
            if (targetBranch.tooManyPipelinesFailed(pastFailureThreshold)){
                tl.debug("too many failures = true");
                postFailuresComment(azureApi, targetBranch, configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName(), configurations.getHostType());
            }
        }   
    }
    catch (err) {
        console.log("error!", err); 
    }
}

function postFailuresComment(azureApi: AbstractAzureApi, targetBranch: Branch, pullRequestId: number, repository: string, project: string, type: string): void {
    let mostRecentTargetFailedPipeline = targetBranch.getMostRecentFailedPipeline();
    if (mostRecentTargetFailedPipeline !== null){
       let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: format(messages.failureComment, mostRecentTargetFailedPipeline.getLink(),  String(targetBranch.getPipelineFailStreak()),  targetBranch.getName(), type)})};
       azureApi.postNewCommentThread(thread, pullRequestId, repository, project);
       tl.debug(messages.commentCompletedMessage);
    }
}

function format(text: string, ...args: string[]): string {
    return text.replace(/{(\d+)}/g, (match, num) => {
      return typeof args[num] !== 'undefined' ? args[num] : match;
    });
  }

run();