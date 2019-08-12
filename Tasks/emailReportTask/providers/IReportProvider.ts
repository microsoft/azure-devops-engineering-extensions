import { Report } from "../model/Report";
import { ReportConfiguration } from "../config/ReportConfiguration";

export interface IReportProvider {
  
  createReportAsync(reportConfig: ReportConfiguration) : Promise<Report>;

}