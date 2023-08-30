import { Report } from "../model/Report";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { ReportDataConfiguration } from "../config/report/ReportDataConfiguration";
export interface IDataProvider {
    getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report>;
}
