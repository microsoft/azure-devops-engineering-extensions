import { IConfigurationProvider } from "../../config/IConfigurationProvider";
import { SendMailCondition } from "../../config/report/SendMailCondition";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { MailConfiguration } from "../../config/mail/MailConfiguration";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
export declare class FileWriter {
    static writeToFile(content: string, fileName: string): void;
}
export declare class MockConfigProvider implements IConfigurationProvider {
    getPipelineConfiguration(): PipelineConfiguration;
    getMailConfiguration(): MailConfiguration;
    getReportDataConfiguration(): ReportDataConfiguration;
    getSendMailCondition(): SendMailCondition;
}
