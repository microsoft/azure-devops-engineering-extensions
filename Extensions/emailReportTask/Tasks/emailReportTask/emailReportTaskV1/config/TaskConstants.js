"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskConstants = void 0;
class TaskConstants {
}
exports.TaskConstants = TaskConstants;
TaskConstants.SUBJECT_INPUTKEY = "subject";
TaskConstants.SENDMAILCONDITION_INPUTKEY = "sendMailConditionConfig";
TaskConstants.INCLUDECOMMITS_INPUTKEY = "includeCommits";
TaskConstants.GROUPTESTRESULTSBY_INPUTKEY = "groupTestResultsBy";
TaskConstants.INCLUDEOTHERSINTOTAL_INPUTKEY = "includeOthersInTotal";
TaskConstants.MAXTESTFAILURESTOSHOW_INPUTKEY = "maxTestFailuresToShow";
TaskConstants.GROUPTESTSUMMARYBY_INPUTKEY = "groupTestSummaryByStr";
TaskConstants.INCLUDERESULTS_INPUTKEY = "includeResultsStr";
TaskConstants.TOADDRESS_INPUTKEY = "toAddress";
TaskConstants.CCADDRESS_INPUTKEY = "ccAddress";
TaskConstants.INCLUDEINTO_INPUTKEY = "includeInToSectionStr";
TaskConstants.INCLUDEINCC_INPUTKEY = "includeInCcSectionStr";
TaskConstants.SMTPCONNECTION_INPUTKEY = "smtpConnectionEndpoint";
// Inputkey value should be "enableTLS" - however changing that will break the task for everyone. See task.dev.json or task.prod.json for the confusion.
// For now -inputkey has to be enableSSL... until AzureDevOps marketplace supports a way to rename params in json
TaskConstants.ENABLETLS_INPUTKEY = "enableSSLOnSmtpConnection";
TaskConstants.USEPREVENV_INPUTKEY = "usePreviousEnvironment";
TaskConstants.DEFAULTDOMAIN_INPUTKEY = "defaultDomain";
TaskConstants.TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
TaskConstants.VSS_CONNECTION_KEY = "SYSTEMVSSCONNECTION";
TaskConstants.ACCESS_PARAMETER = "ACCESSTOKEN";
TaskConstants.PROJECTNAME_KEY = "SYSTEM_TEAMPROJECT";
TaskConstants.PROJECTID_KEY = "SYSTEM_TEAMPROJECTID";
TaskConstants.BUILD_ID_KEY = "BUILD_BUILDID";
TaskConstants.RELEASE_ID_KEY = "RELEASE_RELEASEID";
TaskConstants.HOST_KEY = "SYSTEM_HOSTTYPE";
TaskConstants.ENVIRONMENTID_KEY = "RELEASE_ENVIRONMENTID";
TaskConstants.ENVIRONMENTDEFID_KEY = "RELEASE_DEFINITIONENVIRONMENTID";
//# sourceMappingURL=TaskConstants.js.map