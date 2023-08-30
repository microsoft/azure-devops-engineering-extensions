import { IDataProvider } from "../IDataProvider";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Report } from "../../model/Report";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { ITestResultsClient } from "../restclients/ITestResultsClient";
export declare class TestOwnersDataProvider implements IDataProvider {
    private testResultsClient;
    constructor(testResultsClient: ITestResultsClient);
    getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfig: ReportDataConfiguration): Promise<Report>;
}
