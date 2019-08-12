import { Report } from "./model/Report";
import { MailConfiguration } from "./config/mail/MailConfiguration";

export interface IReportSender {
  sendReportAsync(report: Report, htmlReportMessage: string, mailConfiguration: MailConfiguration) : Promise<void>;
}