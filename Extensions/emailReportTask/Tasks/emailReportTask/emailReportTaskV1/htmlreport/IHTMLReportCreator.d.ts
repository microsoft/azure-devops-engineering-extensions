import { Report } from "../model/Report";
import { ReportConfiguration } from "../config/ReportConfiguration";
export interface IHTMLReportCreator {
    createHtmlReport(report: Report, reportConfiguration: ReportConfiguration): string;
}
