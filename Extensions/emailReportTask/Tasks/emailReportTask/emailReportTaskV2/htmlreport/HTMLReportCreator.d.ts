import { IHTMLReportCreator } from './IHTMLReportCreator';
import { Report } from '../model/Report';
import { ReportConfiguration } from '../config/ReportConfiguration';
export declare class HTMLReportCreator implements IHTMLReportCreator {
    createHtmlReport(report: Report, reportConfiguration: ReportConfiguration): string;
}
