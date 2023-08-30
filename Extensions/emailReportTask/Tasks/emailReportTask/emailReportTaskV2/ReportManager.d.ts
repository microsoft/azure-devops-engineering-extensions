import { IReportProvider } from "./providers/IReportProvider";
import { ReportConfiguration } from "./config/ReportConfiguration";
import { IReportSender } from "./IReportSender";
import { IHTMLReportCreator } from "./htmlreport/IHTMLReportCreator";
export declare class ReportManager {
    private reportProvider;
    private reportSender;
    private htmlReportCreator;
    constructor(reportProvider: IReportProvider, htmlReportCreator: IHTMLReportCreator, reportSender: IReportSender);
    sendReportAsync(reportConfig: ReportConfiguration): Promise<boolean>;
}
