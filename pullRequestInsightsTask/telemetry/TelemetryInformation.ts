export class TelemetryInformation {
  private wasCommentNeeded: string;
  private wasRegressionFound: string;
  private wasFailureFound: string;
  private pipelineId: string;
  private pipelineType: string;

  public postUserConfigurations(
    isLongRunningValidationsEnabled: boolean,
    durationPercentile: number,
    mimimumValidationDuration: number,
    mimimumValidationRegression: number,
    taskTypesForLongRunningValidations: string[],
    statusLink: string
  ): void {
    this.logTelemetry({
      isLongRunningValidationsEnabled: String(isLongRunningValidationsEnabled),
      durationPercentile: durationPercentile,
      mimimumValidationDuration: mimimumValidationDuration,
      mimimumValidationRegression: mimimumValidationRegression,
      taskTypesForLongRunningValidations: taskTypesForLongRunningValidations,
      statusLink: statusLink
    });
  }

  public setPipelineData(pipelineId: number, pipelineType: string): void {
    this.pipelineId = String(pipelineId);
    this.pipelineType = pipelineType;
  }

  public setWasCommentNeeded(
    wasCommentNeeded: boolean
  ) {
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
      wasCommentNeeded: this.wasCommentNeeded,
      wasRegressionFound: this.wasRegressionFound,
      wasFailureFound: this.wasFailureFound
    });
  }

  private logTelemetry(telemetryToLog: {}) {
    console.log(
      "##vso[telemetry.publish area=AgentTasks;feature=PRInsights]" +
        JSON.stringify(telemetryToLog)
    );
  }
}
