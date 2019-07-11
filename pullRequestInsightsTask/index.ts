import tl = require('azure-pipelines-task-lib/task');
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
import messages from './user_messages.json';
import './StringExtensions';
import './StringExtensions';
import { PipelineData } from './PipelineData';
import { TaskInsights } from './TaskInsights';

async function run() {
    try {
        
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
        data.setDurationPercentile(Number(tl.getInput("longRunningValidationPercentile", false)));
        data.setMimimumValidationDurationMinutes(Number(tl.getInput("longRunningValidationMinimumDuration", false)));
        data.setMimimumValidationRegressionMinutes(Number(tl.getInput("longRunningValidationMinimumRegression", false)));
        data.setTaskTypesForLongRunningValidations(tl.getInput("longRunningValidationTaskTypes", true).toLowerCase().split(","));
        data.setStatusLink(tl.getInput("checkStatusLink", false)); 
        tl.debug("pipline data: " + JSON.stringify(data));

        if (!data.getPullRequestId()) {
            tl.debug(messages.notInPullRequestMessage);
        }

        else {
            let taskInsights = new TaskInsights(data);
            taskInsights.invoke();
        }
    }
    catch (err) {
        console.log("error!", err); 
    }
}

run();