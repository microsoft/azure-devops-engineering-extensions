import { IReportSender } from "./IReportSender";
import { MailConfiguration } from "./config/mail/MailConfiguration";
import { Report } from "./model/Report";
export declare class EmailSender implements IReportSender {
    sendReportAsync(report: Report, htmlReportMessage: string, mailConfiguration: MailConfiguration): Promise<boolean>;
    private sendMailAsync;
}
