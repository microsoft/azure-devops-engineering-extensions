import tl = require('azure-pipelines-task-lib/task');
import { AzureApi } from './azureApi';
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { EnvironmentConfigurations } from './environmentConfigurations';
import { Build } from './build';
import fs from 'fs';

async function run() {
    try {
        let configurations = new EnvironmentConfigurations();
        let azureApi = new AzureApi(configurations.getTeamURI(), configurations.getAccessKey());
        let build = new Build(await azureApi.getBuild(configurations.getProjectName(), 
            configurations.getBuildId()), configurations.getPullRequestId());
        if (!build.wasRunFromPullRequest()){
            console.log("build not run from pull request");
        }
        else if (!build.failed()){
            console.log("nothing happened because build did not fail!");
        }
        else {
            let thread : azureGitInterfaces.CommentThread = {comments:  new Array({content: "testing from UPDATED code"})};
            // if (thread.comments !== undefined){
            //     thread.comments.forEach(element => {
            //         console.log(element.content);
            //     });
            // }
          azureApi.postNewCommentThread(thread, configurations.getPullRequestId(), configurations.getRepository(), 
          configurations.getProjectName());
        }
    }
    catch (err) {
        console.log("error!", err); 
    }
    
}

run();