import { IReportProvider } from "./providers/IReportProvider";
import { ReportConfiguration } from "./config/ReportConfiguration";
import { ReportError } from "./exceptions/ReportError";
import { IReportSender } from "./IReportSender";
import { IHTMLReportCreator } from "./htmlreport/IHTMLReportCreator";

export class ReportManager {

  private reportProvider : IReportProvider;
  private reportSender : IReportSender;
  private htmlReportCreator: IHTMLReportCreator;

  constructor(reportProvider: IReportProvider, htmlReportCreator: IHTMLReportCreator, reportSender: IReportSender) {
    this.reportProvider = reportProvider;
    this.reportSender = reportSender;
    this.htmlReportCreator = htmlReportCreator;
  }
  
  public async sendReportAsync(reportConfig: ReportConfiguration) : Promise<void> {
    try {
        console.log("Fetching data for email report");         
        const report = await this.reportProvider.createReportAsync(reportConfig);
        console.log("Created report view model");         

        if (report.$dataMissing) {
            throw new ReportError("Unable to fetch all data for generating report");
        }
        else if (report.$sendMailConditionSatisfied && this.reportSender != null) {
            console.log("Creating report message");
            const htmlMessage = this.htmlReportCreator.createHtmlReport(report, reportConfig);
            await this.reportSender.sendReportAsync(report, htmlMessage, reportConfig.$mailConfiguration);
        } else {
            console.log(`Not sending mail, as the user send mail condition - '${reportConfig.$sendMailCondition}' is not satisfied.`);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
  }
}