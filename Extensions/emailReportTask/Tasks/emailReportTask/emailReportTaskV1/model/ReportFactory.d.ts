import { ReleaseReport } from "./ReleaseReport";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { Report } from "./Report";
import { BuildReport } from "./BuildReport";
export declare class ReportFactory {
    static createNewReport(pipelineConfig: PipelineConfiguration): ReleaseReport | BuildReport;
    static mergeReports(reports: Report[]): Report;
    private static mergeTwoReports;
}
