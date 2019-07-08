import { PipelineData } from "../PipelineData";
import { TaskInsights } from "../TaskInsights";
import tl = require('azure-pipelines-task-lib/task');


function runInvokeTaskTest() {
    let data: PipelineData = new PipelineData();
    data.setAccessKey("***");
    data.setCurrentSourceCommitIteration("b30e56618e418e8ee95ef99056f8ea484abb6915");
    data.setHostType("release");
    data.setProjectName("myepsteam");
    data.setReleaseId(435);
    data.setBuildId(717);
    data.setRepository("myepsteam");
    data.setTeamUri("https://dev.azure.com/vscsepsteam/");
    data.setPullRequestId(10);
    tl.debug(JSON.stringify(data));
    let insights = new TaskInsights();
    insights.invoke(data);

}

runInvokeTaskTest();
