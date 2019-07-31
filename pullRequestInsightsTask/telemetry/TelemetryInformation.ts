export class TelemetryInformation {
  private isLongRunningValidationsEnabled: string;
  private durationPercentile: string;
  private mimimumValidationDuration: string;
  private mimimumValidationRegression: string;
  private taskTypesForLongRunningValidations: string[];
  private statusLink: string;
  private wasCommentNeeded: string;
  private wasRegressionFound: string;
  private wasFailureFound: string;
  private pipelineId: string;
  private pipelineType: string;

  public addUserConfigurations(
    isLongRunningValidationsEnabled: boolean,
    durationPercentile: number,
    mimimumValidationDuration: number,
    mimimumValidationRegression: number,
    taskTypesForLongRunningValidations: string[],
    statusLink: string
  ): void {
    (this.isLongRunningValidationsEnabled = String(
      isLongRunningValidationsEnabled
    )),
      (this.durationPercentile = String(durationPercentile));
    this.mimimumValidationDuration = String(mimimumValidationDuration);
    this.mimimumValidationRegression = String(mimimumValidationRegression);
    this.taskTypesForLongRunningValidations = taskTypesForLongRunningValidations;
    this.statusLink = statusLink;
  }

  public setPipelineData(pipelineId: number, pipelineType: string): void {
    this.pipelineId = String(pipelineId);
    this.pipelineType = pipelineType;
  }

  public setWasCommentNeeded(wasCommentNeeded: boolean) {
    this.wasCommentNeeded = String(wasCommentNeeded);
  }

  public setWasRegressionFound(wasRegressionFound: boolean) {
    this.wasRegressionFound = String(wasRegressionFound);
  }

  public setWasFailureFound(wasFailureFound: boolean) {
    this.wasFailureFound = String(wasFailureFound);
  }

  public logTaskResults(): void {
    this.logTelemetry({
      pipelineId: this.pipelineId,
      pipelineType: this.pipelineType,
      userConfigurations: {
        isLongRunningValidationsEnabled: this.isLongRunningValidationsEnabled,
        durationPercentile: this.durationPercentile,
        mimimumValidationDuration: this.mimimumValidationDuration,
        mimimumValidationRegression: this.mimimumValidationRegression,
        taskTypesForLongRunningValidations: this
          .taskTypesForLongRunningValidations,
        statusLink: this.statusLink
      },
      results: {
        wasCommentNeeded: this.wasCommentNeeded,
        wasRegressionFound: this.wasRegressionFound,
        wasFailureFound: this.wasFailureFound
      }
    });
  }

  private logTelemetry(telemetryToLog: {}) {
    console.log(
      "##vso[telemetry.publish area=AgentTasks;feature=PRInsights]" +
        JSON.stringify(telemetryToLog)
    );
  }
}
