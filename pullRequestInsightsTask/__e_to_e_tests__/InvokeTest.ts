import { PipelineData } from "../PipelineData";
import { TaskInsights } from "../TaskInsights";
import tl = require('azure-pipelines-task-lib/task');


function runInvokeTaskTest() {
    let data: PipelineData = new PipelineData();
    data.setAccessKey("**");
    data.setCurrentSourceCommitIteration("e18f81f64c08bf4214d596816f5bf47f46ea8c20");
    data.setHostType("build");
    data.setProjectName("myepsteam");
    data.setReleaseId(469);
    data.setBuildId(887);
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
