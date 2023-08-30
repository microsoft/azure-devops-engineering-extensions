import { MailConfiguration } from "./mail/MailConfiguration";
import { ReportDataConfiguration } from "./report/ReportDataConfiguration";
import { IConfigurationProvider } from "./IConfigurationProvider";
import { PipelineConfiguration } from "./pipeline/PipelineConfiguration";
import { SendMailCondition } from "./report/SendMailCondition";
export declare class ReportConfiguration {
    private sendMailCondition;
    private mailConfiguration;
    private reportDataConfiguration;
    private pipelineConfiguration;
    constructor(configProvider: IConfigurationProvider);
    validateConfiguration(): void;
    private validateMailConfig;
    get $sendMailCondition(): SendMailCondition;
    get $mailConfiguration(): MailConfiguration;
    get $reportDataConfiguration(): ReportDataConfiguration;
    get $pipelineConfiguration(): PipelineConfiguration;
    private throwError;
}
