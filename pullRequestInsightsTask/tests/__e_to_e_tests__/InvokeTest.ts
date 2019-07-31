import { PipelineData } from "../../config/PipelineData";
import { TaskInsights } from "../../TaskInsights";
import tl = require("azure-pipelines-task-lib/task");

function runInvokeTaskTest(): void {
  const data: PipelineData = new PipelineData();
  data.setAccessKey("**");
  data.setCurrentSourceCommitIteration(
    "055c238e56621240498a601d8b7bcb213d6ef201"
  );
  data.setHostType("build");
  data.setProjectName("AzureDevOps");
  data.setReleaseId(null);
  data.setBuildId(10068354);
  data.setRepository("AzureDevOps");
  data.setTeamUri("https://mseng.visualstudio.com/");
  data.setPullRequestId(490584);
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
