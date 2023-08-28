/**
 * This class collects and sends telemetry for the PR Insights task
 */
export class TelemetryInformation {
  public static readonly TELEMETRY_LINE =
    "##vso[telemetry.publish area=AgentTasks;feature=PRInsights]";

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

  /**
   * Adds user inputs to current telemetry collected without sending it
   * @param isLongRunningValidationsEnabled Boolean determining if long running validations should be collected
   * @param durationPercentile Percentile to use for determining regression
   * @param mimimumValidationDuration Smallest duration to consider a task for long running validations
   * @param mimimumValidationRegression Smallest regression to consider a task for long running validations
   * @param taskTypesForLongRunningValidations Types of tasks to consider for long running validations
   * @param statusLink Link for target branch status check when current pipeline fails
   */
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

  /**
   * Adds current pipeline information to telemetry collected
   * @param pipelineId Id of current pipeline
   * @param pipelineType Type, such as build or release, of current pipeline
   */
  public setPipelineData(pipelineId: number, pipelineType: string): void {
    this.pipelineId = String(pipelineId);
    this.pipelineType = pipelineType;
  }

  /**
   * Adds whether or not task needed to post comment to telemetry collected
   * @param wasCommentNeeded Whether task needed to post comment
   */
  public setWasCommentNeeded(wasCommentNeeded: boolean) {
    this.wasCommentNeeded = String(wasCommentNeeded);
  }

  /**
   * Adds whether or not any regressive tasks were discovered to telemetry collected
   * @param wasRegressionFound Whether regressive tasks were found
   */
  public setWasRegressionFound(wasRegressionFound: boolean) {
    this.wasRegressionFound = String(wasRegressionFound);
  }

  /**
   * Adds whether or not current pipeline was determined to be a failure to telemetry collected
   * @param wasFailureFound Whether current pipeline running is a failed pipeline
   */
  public setWasFailureFound(wasFailureFound: boolean) {
    this.wasFailureFound = String(wasFailureFound);
  }

  /**
   * Formats and sends all telemetry collected to be published
   */
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

  /**
   * Publishes an object as a string as telemetry
   * @param telemetryToLog Object to be logged as a string
   */
  private logTelemetry(telemetryToLog: {}) {
    console.log(
      TelemetryInformation.TELEMETRY_LINE + JSON.stringify(telemetryToLog)
    );
  }
}
