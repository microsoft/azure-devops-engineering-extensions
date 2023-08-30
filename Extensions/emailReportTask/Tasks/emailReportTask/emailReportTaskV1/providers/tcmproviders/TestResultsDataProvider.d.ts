import { IDataProvider } from "../IDataProvider";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Report } from "../../model/Report";
import { ITestResultsClient } from "../restclients/ITestResultsClient";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { IWorkItemClient } from "../restclients/IWorkItemClient";
export declare class TestResultsDataProvider implements IDataProvider {
    private testResultsClient;
    private workItemClient;
    constructor(testResultsClient: ITestResultsClient, workItemClient: IWorkItemClient);
    getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfig: ReportDataConfiguration): Promise<Report>;
    private setFilteredTestResults;
    private getTestResultsWithWorkItems;
    private getTestResultsForResultsGroupWithWorkItemsAsync;
    private getWorkItemsAsync;
    private getTestResultsWithBugRefs;
    private filterTestResults;
    private getIncludedOutcomes;
}
