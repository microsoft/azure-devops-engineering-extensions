"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationProvider = void 0;
const tl = require("azure-pipelines-task-lib");
const TaskConstants_1 = require("./TaskConstants");
const SendMailCondition_1 = require("./report/SendMailCondition");
const MailConfiguration_1 = require("./mail/MailConfiguration");
const RecipientsConfiguration_1 = require("./mail/RecipientsConfiguration");
const SmtpConfiguration_1 = require("./mail/SmtpConfiguration");
const InputError_1 = require("../exceptions/InputError");
const ReportDataConfiguration_1 = require("./report/ReportDataConfiguration");
const TestResultsConfiguration_1 = require("./report/TestResultsConfiguration");
const GroupTestResultsBy_1 = require("./report/GroupTestResultsBy");
const PipelineConfiguration_1 = require("./pipeline/PipelineConfiguration");
const PipelineType_1 = require("./pipeline/PipelineType");
const StringUtils_1 = require("../utils/StringUtils");
const util_1 = require("util");
class ConfigurationProvider {
    constructor() {
        this.initPipelineConfiguration();
        this.initMailConfiguration();
        this.initReportDataConfiguration();
        this.initSendMailCondition();
    }
    getPipelineConfiguration() {
        return this.pipelineConfiguration;
    }
    getMailConfiguration() {
        return this.mailConfiguration;
    }
    getReportDataConfiguration() {
        return this.reportDataConfiguration;
    }
    getSendMailCondition() {
        return this.sendMailCondition;
    }
    /**
     * Gets access token from system
     */
    getAccessKey() {
        return tl.getEndpointAuthorizationParameter(TaskConstants_1.TaskConstants.VSS_CONNECTION_KEY, TaskConstants_1.TaskConstants.ACCESS_PARAMETER, false);
    }
    initPipelineConfiguration() {
        const hostType = tl.getVariable(TaskConstants_1.TaskConstants.HOST_KEY);
        const pipelineType = hostType == "build" ? PipelineType_1.PipelineType.Build : PipelineType_1.PipelineType.Release;
        const pipelineIdKey = pipelineType == PipelineType_1.PipelineType.Build ? TaskConstants_1.TaskConstants.BUILD_ID_KEY : TaskConstants_1.TaskConstants.RELEASE_ID_KEY;
        const pipelineId = Number(tl.getVariable(pipelineIdKey));
        const projectId = tl.getVariable(TaskConstants_1.TaskConstants.PROJECTID_KEY);
        const projectName = tl.getVariable(TaskConstants_1.TaskConstants.PROJECTNAME_KEY);
        const envId = Number(tl.getVariable(TaskConstants_1.TaskConstants.ENVIRONMENTID_KEY));
        const envDefId = Number(tl.getVariable(TaskConstants_1.TaskConstants.ENVIRONMENTDEFID_KEY));
        const usePrevEnvironment = tl.getBoolInput(TaskConstants_1.TaskConstants.USEPREVENV_INPUTKEY);
        const teamUri = tl.getVariable(TaskConstants_1.TaskConstants.TEAM_FOUNDATION_KEY);
        this.pipelineConfiguration = new PipelineConfiguration_1.PipelineConfiguration(pipelineType, pipelineId, projectId, projectName, envId, envDefId, usePrevEnvironment, teamUri, this.getAccessKey());
    }
    initMailConfiguration() {
        const smtpConnectionId = tl.getInput(TaskConstants_1.TaskConstants.SMTPCONNECTION_INPUTKEY, true);
        const endPointScheme = tl.getEndpointAuthorizationScheme(smtpConnectionId, true);
        if (endPointScheme != "UsernamePassword") {
            throw new InputError_1.InputError(`Incorrect EndPoint Scheme Provided - '${endPointScheme}'. Only UserName and Password type Endpoints allowed.`);
        }
        const smtpHost = tl.getEndpointUrl(smtpConnectionId, true).replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
        const userName = tl.getEndpointAuthorizationParameter(smtpConnectionId, "UserName", true);
        const password = tl.getEndpointAuthorizationParameter(smtpConnectionId, "Password", true);
        const enableTLS = tl.getBoolInput(TaskConstants_1.TaskConstants.ENABLETLS_INPUTKEY, true);
        const smtpConfig = new SmtpConfiguration_1.SmtpConfiguration(userName, password, smtpHost, enableTLS);
        // Mail Subject
        const mailSubject = tl.getInput(TaskConstants_1.TaskConstants.SUBJECT_INPUTKEY, true);
        if (StringUtils_1.StringUtils.isNullOrWhiteSpace(mailSubject)) {
            throw new InputError_1.InputError("Email subject not set");
        }
        // Optional inputs
        const toAddresses = tl.getInput(TaskConstants_1.TaskConstants.TOADDRESS_INPUTKEY, false);
        const ccAddresses = tl.getInput(TaskConstants_1.TaskConstants.CCADDRESS_INPUTKEY, false);
        const includeInToAddressesConfig = tl.getInput(TaskConstants_1.TaskConstants.INCLUDEINTO_INPUTKEY, false);
        const includeInCCAddressesConfig = tl.getInput(TaskConstants_1.TaskConstants.INCLUDEINCC_INPUTKEY, false);
        // Addresses Configuration
        const toRecipientsConfiguration = this.getRecipientConfiguration(toAddresses, includeInToAddressesConfig);
        const ccRecipientsConfiguration = this.getRecipientConfiguration(ccAddresses, includeInCCAddressesConfig);
        const defaultDomain = tl.getInput(TaskConstants_1.TaskConstants.DEFAULTDOMAIN_INPUTKEY, true);
        this.mailConfiguration = new MailConfiguration_1.MailConfiguration(mailSubject, toRecipientsConfiguration, ccRecipientsConfiguration, smtpConfig, defaultDomain);
    }
    initReportDataConfiguration() {
        // required inputs
        const groupResultsBy = this.getGroupTestResultsByEnumFromString(tl.getInput(TaskConstants_1.TaskConstants.GROUPTESTRESULTSBY_INPUTKEY, true));
        const includeOthersInTotal = tl.getBoolInput(TaskConstants_1.TaskConstants.INCLUDEOTHERSINTOTAL_INPUTKEY, true);
        const maxTestFailuresToShow = Number(tl.getInput(TaskConstants_1.TaskConstants.MAXTESTFAILURESTOSHOW_INPUTKEY, true));
        const includeCommits = tl.getBoolInput(TaskConstants_1.TaskConstants.INCLUDECOMMITS_INPUTKEY, true);
        // optional inputs
        const includeResultsStr = tl.getInput(TaskConstants_1.TaskConstants.INCLUDERESULTS_INPUTKEY, false);
        const groupTestSummaryByStr = tl.getInput(TaskConstants_1.TaskConstants.GROUPTESTSUMMARYBY_INPUTKEY, false);
        const groupTestSummaryBy = new Array();
        if (!util_1.isNullOrUndefined(groupTestSummaryByStr)) {
            groupTestSummaryByStr.split(",").forEach(element => { groupTestSummaryBy.push(this.getGroupTestResultsByEnumFromString(element)); });
        }
        // derived input values
        const includeResultsConfig = util_1.isNullOrUndefined(includeResultsStr) ? [] : includeResultsStr.split(",");
        const includeFailedTests = includeResultsConfig.includes("1");
        const includeOtherTests = includeResultsConfig.includes("2");
        const includePassedTests = includeResultsConfig.includes("3");
        const includeInconclusiveTests = includeResultsConfig.includes("4");
        const includeNotExecutedTests = includeResultsConfig.includes("5");
        const testResultsConfig = new TestResultsConfiguration_1.TestResultsConfiguration(includeFailedTests, includePassedTests, includeInconclusiveTests, includeNotExecutedTests, includeOtherTests, groupResultsBy, maxTestFailuresToShow);
        this.reportDataConfiguration = new ReportDataConfiguration_1.ReportDataConfiguration(includeCommits, includeOthersInTotal, true, groupTestSummaryBy, testResultsConfig);
    }
    initSendMailCondition() {
        const sendMailConditionStr = tl.getInput(TaskConstants_1.TaskConstants.SENDMAILCONDITION_INPUTKEY);
        let sendMailCondition;
        switch (sendMailConditionStr) {
            case "On Failure":
                sendMailCondition = SendMailCondition_1.SendMailCondition.OnFailure;
                break;
            case "On Success":
                sendMailCondition = SendMailCondition_1.SendMailCondition.OnSuccess;
                break;
            case "On New Failures Only":
                sendMailCondition = SendMailCondition_1.SendMailCondition.OnNewFailuresOnly;
                break;
            default:
                sendMailCondition = SendMailCondition_1.SendMailCondition.Always;
                break;
        }
        this.sendMailCondition = sendMailCondition;
    }
    getRecipientConfiguration(namedRecipients, includeConfigStr) {
        if (includeConfigStr != null) {
            const includeConfig = includeConfigStr.split(",");
            const includeChangesetOwners = includeConfig.includes("1");
            const includeTestOwners = includeConfig.includes("2");
            const includeActiveBugOwners = includeConfig.includes("3");
            const includeCreatedBy = includeConfig.includes("4");
            return new RecipientsConfiguration_1.RecipientsConfiguration(namedRecipients, includeChangesetOwners, includeTestOwners, includeActiveBugOwners, includeCreatedBy);
        }
        return new RecipientsConfiguration_1.RecipientsConfiguration(namedRecipients);
    }
    getGroupTestResultsByEnumFromString(groupResultsByStr) {
        switch (groupResultsByStr) {
            case "Priority": return GroupTestResultsBy_1.GroupTestResultsBy.Priority;
            case "Team": return GroupTestResultsBy_1.GroupTestResultsBy.Team;
            default: return GroupTestResultsBy_1.GroupTestResultsBy.Run;
        }
    }
}
exports.ConfigurationProvider = ConfigurationProvider;
//# sourceMappingURL=ConfigurationProvider.js.map