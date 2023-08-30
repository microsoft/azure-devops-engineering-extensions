import { IPostProcessor } from "./IPostProcessor";
import { Report } from "../model/Report";
import { ReportConfiguration } from "../config/ReportConfiguration";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { ITestResultsClient } from "./restclients/ITestResultsClient";
export declare class SendMailConditionProcessor implements IPostProcessor {
    private testResultsClient;
    private readonly TestResultFieldsToQuery;
    constructor(testResultsClient: ITestResultsClient);
    processReportAsync(reportConfig: ReportConfiguration, report: Report): Promise<boolean>;
    hasPreviousReleaseGotSameFailuresAsync(report: Report, config: PipelineConfiguration, hasTestFailures: boolean, hasFailedTasks: boolean): Promise<boolean>;
    private getFailureCountFromSummary;
    private fetchFailedTestCaseIdsAsync;
}
