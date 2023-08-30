import { ReportConfiguration } from "../config/ReportConfiguration";
import { Report } from "../model/Report";
export interface IPostProcessor {
    processReportAsync(reportConfig: ReportConfiguration, finalReport: Report): Promise<boolean>;
}
