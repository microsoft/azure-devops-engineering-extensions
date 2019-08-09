/**
 * This class contains all variables needed for PR Insights task to run, including variables fetched from the environemnt and variables set by user inputs
 * Enables greater testability by creating single object with all varaibles relied upon by task
 */
export class PipelineData {
  private projectName: string;
  private accessKey: string;
  private hostType: string;
  private pullRequestId: number;
  private teamUri: string;
  private repository: string;
  private buildId: number;
  private releaseId: number;
  private currentSourceCommitIteration: string;
  private isLongRunningValidationsEnabled: boolean;
  private durationPercentile: number;
  private mimimumValidationDuration: number;
  private mimimumValidationRegression: number;
  private taskTypesForLongRunningValidations: string[];
  private statusLink: string;
  private feedbackLine: string;

  public setProjectName(projectName: string): void {
    this.projectName = projectName;
  }

  public getProjectName(): string {
    return this.projectName;
  }

  public setHostType(hostType: string): void {
    this.hostType = hostType;
  }

  public getHostType(): string {
    return this.hostType;
  }

  public setRepository(repository: string): void {
    this.repository = repository;
  }

  public getRepository(): string {
    return this.repository;
  }

  public getBuildId(): number {
    return this.buildId;
  }

  public setBuildId(buildId: number): void {
    this.buildId = buildId;
  }
  public getReleaseId(): number {
    return this.releaseId;
  }

  public setReleaseId(releaseId: number): void {
    this.releaseId = releaseId;
  }

  public getCurrentSourceCommitIteration(): string {
    return this.currentSourceCommitIteration;
  }

  public setCurrentSourceCommitIteration(
    currentSourceCommitIteration: string
  ): void {
    this.currentSourceCommitIteration = currentSourceCommitIteration;
  }

  public getTeamUri(): string {
    return this.teamUri;
  }

  public setTeamUri(teamUri: string): void {
    this.teamUri = teamUri;
  }

  public getAccessKey(): string {
    return this.accessKey;
  }

  public setAccessKey(accessKey: string): void {
    this.accessKey = accessKey;
  }

  public getPullRequestId(): number {
    return this.pullRequestId;
  }

  public setPullRequestId(pullRequestId: number): void {
    this.pullRequestId = pullRequestId;
  }

  public isLongRunningValidationFeatureEnabled(): boolean {
    return this.isLongRunningValidationsEnabled;
  }
  public setIsLongRunningValidationFeatureEnabled(isEnabled: boolean) {
    this.isLongRunningValidationsEnabled = isEnabled;
  }

  public getDurationPercentile(): number {
    return this.durationPercentile;
  }

  public setDurationPercentile(durationPercentile: number): void {
    this.durationPercentile = durationPercentile;
  }

  public getMimimumValidationDurationSeconds(): number {
    return this.mimimumValidationDuration;
  }

  public setMimimumValidationDurationSeconds(
    mimimumValidationDuration: number
  ): void {
    this.mimimumValidationDuration = mimimumValidationDuration;
  }

  public setMimimumValidationRegressionSeconds(
    mimimumValidationRegression: number
  ): void {
    this.mimimumValidationRegression = mimimumValidationRegression;
  }

  public getMimimumValidationRegressionSeconds(): number {
    return this.mimimumValidationRegression;
  }

  public setTaskTypesForLongRunningValidations(
    taskTypesForLongRunningValidations: string[]
  ): void {
    this.taskTypesForLongRunningValidations = taskTypesForLongRunningValidations;
  }

  public getTaskTypesForLongRunningValidations(): string[] {
    return this.taskTypesForLongRunningValidations;
  }

  public getStatusLink(): string {
    return this.statusLink;
  }

  public setStatusLink(statusLink: string) {
    this.statusLink = statusLink;
  }

  public getFeedbackLine(): string {
    return this.feedbackLine;
  }

  public setFeedbackLine(feedbackLine: string) {
    this.feedbackLine = feedbackLine;
  }
}
