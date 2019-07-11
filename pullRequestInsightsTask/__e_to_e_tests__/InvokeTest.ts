import { PipelineData } from "../PipelineData";
import { TaskInsights } from "../TaskInsights";
import tl = require('azure-pipelines-task-lib/task');


function runInvokeTaskTest() {
    let data: PipelineData = new PipelineData();
    data.setAccessKey("**");
    data.setCurrentSourceCommitIteration("cc5f61a8519633374544e483eaed85aa7f37ae33");
    data.setHostType("build");
    data.setProjectName("myepsteam");
    data.setReleaseId(469);
    data.setBuildId(848);
    data.setRepository("myepsteam");
    data.setTeamUri("https://vscsepsteam.visualstudio.com/");
    data.setPullRequestId(10);
    data.setDurationPercentile(1);
    data.setMimimumValidationDurationSeconds(0);
    data.setMimimumValidationRegressionSeconds(0);
    data.setTaskTypesForLongRunningValidations(["powershell"]);
    data.setIsLongRunningValidationFeatureEnabled(true);
    tl.debug(JSON.stringify(data));
    let insights = new TaskInsights(data);
    insights.invoke();
}

runInvokeTaskTest();
