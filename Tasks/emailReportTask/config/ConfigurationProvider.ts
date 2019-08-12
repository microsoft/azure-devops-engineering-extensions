import tl = require("azure-pipelines-task-lib/task");
import { IConfigurationProvider } from "./IConfigurationProvider";
import { TaskConstants } from "./TaskConstants";
import { SendMailCondition } from "./report/SendMailCondition";
import { MailConfiguration } from "./mail/MailConfiguration";
import { RecipientsConfiguration } from "./mail/RecipientsConfiguration";
import { SmtpConfiguration } from "./mail/SmtpConfiguration";
import { InputError } from "../exceptions/InputError";
import { ReportDataConfiguration } from "./report/ReportDataConfiguration";
import { TestResultsConfiguration } from "./report/TestResultsConfiguration";
import { GroupTestResultsBy } from "./report/GroupTestResultsBy";
import { PipelineConfiguration } from "./pipeline/PipelineConfiguration";
import { PipelineType } from "./pipeline/PipelineType";
import { StringUtils } from "../utils/StringUtils";

export class ConfigurationProvider implements IConfigurationProvider {
  private pipelineConfiguration: PipelineConfiguration;
  private mailConfiguration: MailConfiguration;
  private reportDataConfiguration: ReportDataConfiguration;
  private sendMailCondition: SendMailCondition;

  constructor() {
    this.initPipelineConfiguration();
    this.initMailConfiguration();
    this.initReportDataConfiguration();
    this.initSendMailCondition();
  }

  getPipelineConfiguration(): PipelineConfiguration {
    return this.pipelineConfiguration;
  }
  getMailConfiguration(): MailConfiguration {
    return this.mailConfiguration;
  }
  getReportDataConfiguration(): ReportDataConfiguration {
    return this.reportDataConfiguration;
  }
  getSendMailCondition(): SendMailCondition {
    return this.sendMailCondition;
  }

  /**
   * Gets access token from system
   */
  private getAccessKey(): string {
    return tl.getEndpointAuthorizationParameter(
      TaskConstants.VSS_CONNECTION_KEY,
      TaskConstants.ACCESS_PARAMETER,
      false
    );
  }

  private initPipelineConfiguration(): void {
    const hostType = tl.getVariable(TaskConstants.HOST_KEY);
    const pipelineType = hostType == "build" ? PipelineType.Build : PipelineType.Release;
    const pipelineIdKey = pipelineType == PipelineType.Build ? TaskConstants.BUILD_ID_KEY : TaskConstants.RELEASE_ID_KEY;

    const pipelineId = Number(tl.getVariable(pipelineIdKey));
    const projectId = tl.getVariable(TaskConstants.PROJECTID_KEY);
    const projectName = tl.getVariable(TaskConstants.PROJECTNAME_KEY);

    const envId = Number(tl.getVariable(TaskConstants.ENVIRONMENTID_KEY));
    const envDefId = Number(tl.getVariable(TaskConstants.ENVIRONMENTDEFID_KEY));

    const usePrevEnvironment = tl.getBoolInput(TaskConstants.USEPREVENV_INPUTKEY);
    const teamUri = tl.getVariable(TaskConstants.TEAM_FOUNDATION_KEY)
    this.pipelineConfiguration = new PipelineConfiguration(pipelineType, pipelineId, projectId, projectName, envId, envDefId, usePrevEnvironment, teamUri, this.getAccessKey());
  }

  private initMailConfiguration(): void {
    //SMTP
    const endPointScheme = tl.getEndpointAuthorizationScheme(TaskConstants.SMTPCONNECTION_INPUTKEY, true);
    if (endPointScheme != "UsernamePassword") {
      throw new InputError("Incorrect EndPoint Scheme Provided. Only UserName and Password type Endpoints allowed.");
    }

    const smtpHost = tl.getEndpointUrl(TaskConstants.SMTPCONNECTION_INPUTKEY, true);
    const userName = tl.getEndpointAuthorizationParameter(TaskConstants.SMTPCONNECTION_INPUTKEY, "UserName", true);
    const password = tl.getEndpointAuthorizationParameter(TaskConstants.SMTPCONNECTION_INPUTKEY, "Password", true);
    const enableSSLOnSmtpConnection = tl.getBoolInput(TaskConstants.ENABLESSL_INPUTKEY, true);

    const smtpConfig = new SmtpConfiguration(userName, password, smtpHost, enableSSLOnSmtpConnection);

    // Mail Subject
    const mailSubject = tl.getInput(TaskConstants.SUBJECT_INPUTKEY, true);
    if (StringUtils.isNullOrWhiteSpace(mailSubject))
    {
      throw new InputError("Email subject not set");
    }

    // Optional inputs
    const toAddresses = tl.getInput(TaskConstants.TOADDRESS_INPUTKEY, false);
    const ccAddresses = tl.getInput(TaskConstants.CCADDRESS_INPUTKEY, false);
    const includeInToAddressesConfig = tl.getInput(TaskConstants.INCLUDEINTO_INPUTKEY, false);
    const includeInCCAddressesConfig = tl.getInput(TaskConstants.INCLUDEINCC_INPUTKEY, false);

    // Addresses Configuration
    const toRecipientsConfiguration = this.getRecipientConfiguration(toAddresses, includeInToAddressesConfig);
    const ccRecipientsConfiguration = this.getRecipientConfiguration(ccAddresses, includeInCCAddressesConfig);

    const defaultDomain = tl.getInput(TaskConstants.DEFAULTDOMAIN_INPUTKEY, true);

    this.mailConfiguration = new MailConfiguration(mailSubject, toRecipientsConfiguration, ccRecipientsConfiguration, smtpConfig, defaultDomain);
  }

  private initReportDataConfiguration(): void {
    // required inputs
    const groupResultsBy = this.getGroupTestResultsByEnumFromString(tl.getInput(TaskConstants.GROUPTESTRESULTSBY_INPUTKEY, true));
    const includeOthersInTotal = tl.getBoolInput(TaskConstants.INCLUDEOTHERSINTOTAL_INPUTKEY, true);
    const maxTestFailuresToShow = Number(tl.getInput(TaskConstants.MAXTESTFAILURESTOSHOW_INPUTKEY, true));
    const includeCommits = tl.getBoolInput(TaskConstants.INCLUDECOMMITS_INPUTKEY, true);

    // optional inputs
    const includeResultsStr = tl.getInput(TaskConstants.INCLUDERESULTS_INPUTKEY, false);
    const groupTestSummaryByStr = tl.getInput(TaskConstants.GROUPTESTSUMMARYBY_INPUTKEY, false);

    const groupTestSummaryBy: Array<GroupTestResultsBy> = new Array();
    if (groupTestSummaryByStr != null) {
      groupTestSummaryByStr.split(",").forEach(element => { groupTestSummaryBy.push(this.getGroupTestResultsByEnumFromString(element)) });
    }

    // derived input values
    const includeResultsConfig = includeResultsStr == null ? includeResultsStr.split(",") : [];
    const includeFailedTests = includeResultsConfig.includes("1");
    const includeOtherTests = includeResultsConfig.includes("2");
    const includePassedTests = includeResultsConfig.includes("3");
    const includeInconclusiveTests = includeResultsConfig.includes("4");
    const includeNotExecutedTests = includeResultsConfig.includes("5");

    const testResultsConfig = new TestResultsConfiguration(includeFailedTests, includePassedTests, includeInconclusiveTests, includeNotExecutedTests, includeOtherTests, groupResultsBy, maxTestFailuresToShow);

    this.reportDataConfiguration = new ReportDataConfiguration(includeCommits, includeOthersInTotal, true, groupTestSummaryBy, testResultsConfig);
  }

  initSendMailCondition(): void {
    const sendMailConditionStr = tl.getInput(TaskConstants.SENDMAILCONDITION_INPUTKEY);
    let sendMailCondition: SendMailCondition;
    switch (sendMailConditionStr) {
      case "On Failure": sendMailCondition = SendMailCondition.OnFailure; break;
      case "On Success": sendMailCondition = SendMailCondition.OnSuccess; break;
      case "On New Failures Only": sendMailCondition = SendMailCondition.OnNewFailuresOnly; break;
      default: sendMailCondition = SendMailCondition.Always; break;
    }
    this.sendMailCondition = sendMailCondition;
  }

  private getRecipientConfiguration(namedRecipients: string, includeConfigStr: string): RecipientsConfiguration {
    if (includeConfigStr != null) {
      const includeConfig = includeConfigStr.split(",");
      const includeChangesetOwners = includeConfig.includes("1");
      const includeTestOwners = includeConfig.includes("2");
      const includeActiveBugOwners = includeConfig.includes("3");
      const includeCreatedBy = includeConfig.includes("4");

      return new RecipientsConfiguration(namedRecipients, includeChangesetOwners, includeTestOwners, includeActiveBugOwners, includeCreatedBy);
    }

    return new RecipientsConfiguration(namedRecipients);
  }

  private getGroupTestResultsByEnumFromString(groupResultsByStr: string): GroupTestResultsBy {
    switch (groupResultsByStr) {
      case "Priority": return GroupTestResultsBy.Priority;
      case "Team": return GroupTestResultsBy.Team;
      default: return GroupTestResultsBy.Run;
    }
  }
}
