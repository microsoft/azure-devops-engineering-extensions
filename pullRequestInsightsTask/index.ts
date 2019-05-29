import tl = require('azure-pipelines-task-lib/task');
import { AzureApi, AzureApiFactory } from './azureApi';
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { EnvironmentConfigurations } from './environmentConfigurations';
import { Build, IPipeline } from './pipeline';
let fs = require('fs');
import messages from './user_messages.json';
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Branch } from './branch';

async function run() {
    try {
        const pastFailureThreshold: number = 2; 
        const numberBuildsToQuery: number = 10;
        const desiredBuildReasons: number = azureBuildInterfaces.BuildReason.BatchedCI + azureBuildInterfaces.BuildReason.IndividualCI;
        const desiredBuildStatus: number = azureBuildInterfaces.BuildStatus.Completed;
        let configurations: EnvironmentConfigurations = new EnvironmentConfigurations();
        let azureApiFactory: AzureApiFactory = new AzureApiFactory();
        //let azureApi: AzureApi = new AzureApi(configurations.getTeamURI(), configurations.getAccessKey());
        let azureApi = await azureApiFactory.create(configurations); 
        tl.debug("past creating azure api");
        let currentProject: string = configurations.getProjectName();
        let currentPipeline: IPipeline = await azureApi.getCurrentPipeline(configurations);

        if (!configurations.getPullRequestId()){
            tl.debug(messages.notInPullRequestMessage);
        }
        else if (!currentPipeline.isFailure()){
            tl.debug(messages.noFailureMessage);
        }
        else {
            let retrievedPipelines: IPipeline[] = await azureApi.getMostRecentPipelinesOfCurrentType(currentProject, currentPipeline.getDefinitionId(), desiredBuildReasons, desiredBuildStatus, numberBuildsToQuery, configurations.getTargetBranch());
            let targetBranch: Branch = new Branch(configurations.getTargetBranch(), retrievedPipelines); //convertBuildData(retrievedBuilds));
            if (targetBranch.tooManyPipelinesFailed(pastFailureThreshold)){
                postFailuresComment(azureApi, targetBranch, configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName());
            }
        }   
    }
    catch (err) {
        console.log("error!", err); 
    }
}

function postFailuresComment(azureApi: AzureApi, targetBranch: Branch, pullRequestId: number, repository: string, project: string): void {
    let mostRecentTargetFailedPipeline = targetBranch.getMostRecentFailedPipeline();
    if (mostRecentTargetFailedPipeline !== null){
       let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: format(messages.buildFailureComment, mostRecentTargetFailedPipeline.getLink(),  String(targetBranch.getPipelineFailStreak()),  targetBranch.getName())})};
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