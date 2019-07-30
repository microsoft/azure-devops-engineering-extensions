import { PipelineData } from "../../config/PipelineData";
import { TaskInsights } from "../../TaskInsights";
import tl = require("azure-pipelines-task-lib/task");

function runInvokeTaskTest(): void {
  const data: PipelineData = new PipelineData();
  data.setAccessKey("**");
  data.setCurrentSourceCommitIteration(
    "92990b22587c45413ae049b320fa1a6711496cca"
  );
  data.setHostType("release");
  data.setProjectName("AzureDevOps");
  data.setReleaseId(11433455);
  data.setBuildId(null);
  data.setRepository("AzureDevOps");
  data.setTeamUri("https://dev.azure.com/mseng/");
  data.setPullRequestId(490741);
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
