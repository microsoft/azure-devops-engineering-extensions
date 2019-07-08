import { PipelineData } from "../PipelineData";
import { TaskInsights } from "../TaskInsights";
import tl = require('azure-pipelines-task-lib/task');


function runInvokeTaskTest() {
    let data: PipelineData = new PipelineData();
    data.setAccessKey("***");
    data.setCurrentSourceCommitIteration("d3c5bf52");
    data.setHostType("build");
    data.setProjectName("AzureDevOps");
    data.setReleaseId(0);
    data.setBuildId(9845858);
    data.setRepository("AzureDevOps");
    data.setTeamUri("https://mseng.visualstudio.com/");
    data.setPullRequestId(482786);

    tl.debug(JSON.stringify(data));

    let insights = new TaskInsights();
    insights.invoke(data);

}

runInvokeTaskTest();
