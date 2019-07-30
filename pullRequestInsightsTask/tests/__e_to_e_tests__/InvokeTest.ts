import { PipelineData } from "../../config/PipelineData";
import { TaskInsights } from "../../TaskInsights";
import tl = require("azure-pipelines-task-lib/task");

function runInvokeTaskTest(): void {
  const data: PipelineData = new PipelineData();
  data.setAccessKey("**");
  data.setCurrentSourceCommitIteration(
    "cefad438af6c56e09388f5cc614454ba7164dde9"
  );
  data.setHostType("build");
  data.setProjectName("AzureDevOps");
  data.setReleaseId(null);
  data.setBuildId(10067935);
  data.setRepository("AzureDevOps");
  data.setTeamUri("https://dev.azure.com/mseng/");
  data.setPullRequestId(489609);
  data.setDurationPercentile(1);
  data.setMimimumValidationDurationSeconds(0);
  data.setMimimumValidationRegressionSeconds(0);
  data.setTaskTypesForLongRunningValidations(["powershell"]);
  data.setIsLongRunningValidationFeatureEnabled(true);
  console.log(JSON.stringify(data));
  const insights = new TaskInsights(data);
  insights.invoke();
}

runInvokeTaskTest();
