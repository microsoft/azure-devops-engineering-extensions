export class PipelineData {

    private projectName: string;
    private accessKey: string
    private hostType: string;
    private pullRequestId: number
    private teamUri: string
    private repository: string
    private buildId: number
    private releaseId: number
    private currentSourceCommitIteration: string
    private durationPercentile: number;
    private mimimumValidationDuration: number;
    private mimimumValidationRegression: number;
    
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

    public setCurrentSourceCommitIteration(currentSourceCommitIteration: string): void {
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

    public getDurationPercentile(): number {
        return this.durationPercentile;
    }

    public setDurationPercentile(durationPercentile: number): void {
        this.durationPercentile = durationPercentile;
    }

    public getMimimumValidationDurationMinutes(): number {
        return this.mimimumValidationDuration;
    }

    public setMimimumValidationDurationMinutes(mimimumValidationDuration: number): void {
        this.mimimumValidationDuration = mimimumValidationDuration;
    }

    public setMimimumValidationRegressionMinutes(mimimumValidationRegression: number): void {
        this.mimimumValidationRegression = mimimumValidationRegression;
    }

    public getMimimumValidationRegressionMinutes(): number {
        return this.mimimumValidationRegression;
    }

}