import { PipelineData } from "../../config/PipelineData";
import { TaskInsights } from "../../TaskInsights";
import tl = require("azure-pipelines-task-lib/task");

function runInvokeTaskTest(): void {
  const data: PipelineData = new PipelineData();
  data.setAccessKey("**");
  data.setCurrentSourceCommitIteration(
    "1919302351f118af5cfa12286c36fc3aa3322b57"
  );
  data.setHostType("build");
  data.setProjectName("AzureDevOps");
  data.setReleaseId(11156565);
  data.setBuildId(9947228);
  data.setRepository("AzureDevOps");
  data.setTeamUri("https://dev.azure.com/mseng/");
  data.setPullRequestId(486147);
  data.setDurationPercentile(1);
  data.setMimimumValidationDurationSeconds(0);
  data.setMimimumValidationRegressionSeconds(0);
  data.setTaskTypesForLongRunningValidations(["powershell"]);
  data.setIsLongRunningValidationFeatureEnabled(true);
  tl.debug(JSON.stringify(data));
  const insights = new TaskInsights(data);
  insights.invoke();
}

runInvokeTaskTest();
