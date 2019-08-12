import { MailConfiguration } from "./mail/MailConfiguration";
import { ReportDataConfiguration } from "./report/ReportDataConfiguration";
import { IConfigurationProvider } from "./IConfigurationProvider";
import { PipelineConfiguration } from "./pipeline/PipelineConfiguration";
import { SendMailCondition } from "./report/SendMailCondition";
import { ReportInputError } from "../exceptions/ReportInputError";
import { TaskConstants } from "./TaskConstants";
import { StringUtils } from "../utils/StringUtils";

export class ReportConfiguration
{
  private sendMailCondition: SendMailCondition;
  private mailConfiguration: MailConfiguration;
  private reportDataConfiguration: ReportDataConfiguration;  
  private pipelineConfiguration: PipelineConfiguration;  

  constructor(configProvider: IConfigurationProvider)
  {
    this.sendMailCondition = configProvider.getSendMailCondition();
    this.mailConfiguration = configProvider.getMailConfiguration();
    this.reportDataConfiguration = configProvider.getReportDataConfiguration();
    this.pipelineConfiguration = configProvider.getPipelineConfiguration();
    
    this.validateConfiguration();
  }

  validateConfiguration() {
    if(this.sendMailCondition == undefined || this.mailConfiguration == null || this.reportDataConfiguration == null || this.pipelineConfiguration == null || this.reportDataConfiguration.$testResultsConfig == null)
    {
        throw new ReportInputError("Undefined Inputs found. Please check inputs.!!!");
    }

    if (this.reportDataConfiguration.$testResultsConfig.$maxItemsToShow <= 0)
    {
      this.throwError(TaskConstants.MAXTESTFAILURESTOSHOW_INPUTKEY, this.reportDataConfiguration.$testResultsConfig.$maxItemsToShow, "be > 0");
    }

    this.validateMailConfig();
  }

  private validateMailConfig()
  {
    if (StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$mailSubject))
    {
      this.throwError(TaskConstants.SUBJECT_INPUTKEY, this.mailConfiguration.$mailSubject, "be specified");
    }

    if (StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$smtpConfig.$smtpHost))
    {
      this.throwError(TaskConstants.SMTPCONNECTION_INPUTKEY, this.mailConfiguration.$smtpConfig.$smtpHost, "specify SMTP Host URL");
    }

    if (StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$smtpConfig.$userName))
    {
      this.throwError(TaskConstants.SMTPCONNECTION_INPUTKEY, this.mailConfiguration.$smtpConfig.$userName, "specify SMTP UserName");
    }

    if (StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$smtpConfig.$password))
    {
      this.throwError(TaskConstants.SMTPCONNECTION_INPUTKEY, this.mailConfiguration.$smtpConfig.$password, "specify SMTP Password");
    }
  }

  // Getters
  public get $sendMailCondition(): SendMailCondition {
		return this.sendMailCondition;
  }
  
  public get $mailConfiguration(): MailConfiguration {
		return this.mailConfiguration;
  }
  
  public get $reportDataConfiguration(): ReportDataConfiguration {
		return this.reportDataConfiguration;
  }
  
  public get $pipelineConfiguration(): PipelineConfiguration {
		return this.pipelineConfiguration;
  }
  
  private throwError(prefix: string, suffix: any, expectation: string)
  {
    throw new ReportInputError(`${prefix} should ${expectation}. Actual Input value: '${suffix}'`);
  }
}