import { IConfigurationProvider } from "./IConfigurationProvider";
import { SendMailCondition } from "./report/SendMailCondition";
import { MailConfiguration } from "./mail/MailConfiguration";
import { ReportDataConfiguration } from "./report/ReportDataConfiguration";
import { PipelineConfiguration } from "./pipeline/PipelineConfiguration";
export declare class ConfigurationProvider implements IConfigurationProvider {
    private pipelineConfiguration;
    private mailConfiguration;
    private reportDataConfiguration;
    private sendMailCondition;
    constructor();
    getPipelineConfiguration(): PipelineConfiguration;
    getMailConfiguration(): MailConfiguration;
    getReportDataConfiguration(): ReportDataConfiguration;
    getSendMailCondition(): SendMailCondition;
    /**
     * Gets access token from system
     */
    private getAccessKey;
    private initPipelineConfiguration;
    private initMailConfiguration;
    private initReportDataConfiguration;
    initSendMailCondition(): void;
    private getRecipientConfiguration;
    private getGroupTestResultsByEnumFromString;
}
