import { IDataProvider } from "../IDataProvider";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Report } from "../../model/Report";
import { ITestResultsClient } from "../restclients/ITestResultsClient";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
export declare class TestSummaryDataProvider implements IDataProvider {
    private testResultsClient;
    constructor(testResultsClient: ITestResultsClient);
    getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report>;
    private getTestSummaryByPriorityAsync;
    private getTestRunSummaryWithPriorityAsync;
    private getSummaryByRun;
    private getTestSummaryDataByPriorityAsync;
}
