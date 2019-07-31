import tl = require("azure-pipelines-task-lib/task");
import { EnvironmentConfigurations } from "./config/environmentConfigurations";
import messages from "./resources/user_messages.json";
import "./utils/StringExtensions";
import { PipelineData } from "./config/PipelineData";
import { TaskInsights } from "./TaskInsights";

/**
 * Entry point of task
 * Sets all necessary variables from environment and user configurations
 * Invokes task logic as long as task is running within pull request pipeline
 */
async function run(): Promise<void> {
  try {
    const environmentConfigurations: EnvironmentConfigurations = new EnvironmentConfigurations();
    const data: PipelineData = new PipelineData();
    data.setAccessKey(environmentConfigurations.getAccessKey());
    data.setCurrentSourceCommitIteration(
      environmentConfigurations.getValue(
        EnvironmentConfigurations.SOURCE_COMMIT_ITERATION_KEY
      )
    );
    data.setHostType(
      environmentConfigurations.getValue(EnvironmentConfigurations.HOST_KEY)
    );
    data.setProjectName(
      environmentConfigurations.getValue(EnvironmentConfigurations.PROJECT_KEY)
    );
    data.setReleaseId(
      Number(
        environmentConfigurations.getValue(
          EnvironmentConfigurations.RELEASE_ID_KEY
        )
      )
    );
    data.setBuildId(
      Number(
        environmentConfigurations.getValue(
          EnvironmentConfigurations.BUILD_ID_KEY
        )
      )
    );
    data.setRepository(
      environmentConfigurations.getValue(
        EnvironmentConfigurations.REPOSITORY_KEY
      )
    );
    data.setTeamUri(
      environmentConfigurations.getValue(
        EnvironmentConfigurations.TEAM_FOUNDATION_KEY
      )
    );
    data.setPullRequestId(environmentConfigurations.getPullRequestId());
    data.setIsLongRunningValidationFeatureEnabled(
      tl.getBoolInput("enableLongRunningValidationAnalysis")
    );
    data.setDurationPercentile(
      Number(tl.getInput("longRunningValidationPercentile"))
    );
    data.setMimimumValidationDurationSeconds(
      Number(tl.getInput("longRunningValidationMinimumDuration"))
    );
    data.setMimimumValidationRegressionSeconds(
      Number(tl.getInput("longRunningValidationMinimumRegression"))
    );
    data.setTaskTypesForLongRunningValidations(null);
    if (tl.getInput("longRunningValidationTaskTypes")) {
      data.setTaskTypesForLongRunningValidations(
        tl
          .getInput("longRunningValidationTaskTypes", true)
          .toLowerCase()
          .split(",")
      );
    }
    data.setStatusLink(tl.getInput("checkStatusLink"));
    console.log("pipline data: " + JSON.stringify(data));

    if (!data.getPullRequestId()) {
      console.log(messages.notInPullRequestMessage);
    } else {
      const taskInsights: TaskInsights = new TaskInsights(data);
      taskInsights.invoke();
    }
  } catch (err) {
    console.log("error!", err);
  }
}

run();
