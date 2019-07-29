export class TelemetryInformation {
  public postUserConfigurations(
    isLongRunningValidationsEnabled: boolean,
    durationPercentile: number,
    mimimumValidationDuration: number,
    mimimumValidationRegression: number,
    taskTypesForLongRunningValidations: string[],
    statusLink: string
  ): void {
    const userConfigurations = {
      isLongRunningValidationsEnabled: String(isLongRunningValidationsEnabled),
      durationPercentile: durationPercentile,
      mimimumValidationDuration: mimimumValidationDuration,
      mimimumValidationRegression: mimimumValidationRegression,
      taskTypesForLongRunningValidations: taskTypesForLongRunningValidations,
      statusLink: statusLink
    };
    console.log(
      "##vso[telemetry.publish area=AgentTasks;feature=PRInsights]" +
        JSON.stringify(userConfigurations)
    );
  }
}
