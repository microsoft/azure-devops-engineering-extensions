import { SendMailCondition } from "./report/SendMailCondition";
import { PipelineConfiguration } from "./pipeline/PipelineConfiguration";
import { MailConfiguration } from "./mail/MailConfiguration";
import { ReportDataConfiguration } from "./report/ReportDataConfiguration";

export interface IConfigurationProvider {

  getPipelineConfiguration(): PipelineConfiguration;

  getMailConfiguration(): MailConfiguration;

  getReportDataConfiguration(): ReportDataConfiguration;

  getSendMailCondition(): SendMailCondition;

}