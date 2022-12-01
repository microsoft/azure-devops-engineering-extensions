export class TaskConstants {
  public static readonly SUBJECT_INPUTKEY = "subject";
  public static readonly SENDMAILCONDITION_INPUTKEY = "sendMailConditionConfig";
  public static readonly INCLUDECOMMITS_INPUTKEY = "includeCommits";
  public static readonly GROUPTESTRESULTSBY_INPUTKEY = "groupTestResultsBy";
  public static readonly INCLUDEOTHERSINTOTAL_INPUTKEY = "includeOthersInTotal";
  public static readonly MAXTESTFAILURESTOSHOW_INPUTKEY = "maxTestFailuresToShow";
  public static readonly GROUPTESTSUMMARYBY_INPUTKEY = "groupTestSummaryByStr";
  public static readonly INCLUDERESULTS_INPUTKEY = "includeResultsStr";
  public static readonly FROMADDRESS_INPUTKEY = "fromAddress";
  public static readonly TOADDRESS_INPUTKEY = "toAddress";
  public static readonly CCADDRESS_INPUTKEY = "ccAddress";
  public static readonly INCLUDEINTO_INPUTKEY = "includeInToSectionStr";
  public static readonly INCLUDEINCC_INPUTKEY = "includeInCcSectionStr";
  public static readonly SMTPCONNECTION_INPUTKEY = "smtpConnectionEndpoint";
  // Inputkey value should be "enableTLS" - however changing that will break the task for everyone. See task.dev.json or task.prod.json for the confusion.
  // For now -inputkey has to be enableSSL... until AzureDevOps marketplace supports a way to rename params in json
  public static readonly ENABLETLS_INPUTKEY = "enableSSLOnSmtpConnection";
  public static readonly USEPREVENV_INPUTKEY = "usePreviousEnvironment";
  public static readonly DEFAULTDOMAIN_INPUTKEY = "defaultDomain";

  public static readonly TEAM_FOUNDATION_KEY: string =
    "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
  public static readonly VSS_CONNECTION_KEY: string = "SYSTEMVSSCONNECTION";
  public static readonly ACCESS_PARAMETER: string = "ACCESSTOKEN";
  public static readonly PROJECTNAME_KEY: string = "SYSTEM_TEAMPROJECT";
  public static readonly PROJECTID_KEY: string = "SYSTEM_TEAMPROJECTID";
  public static readonly BUILD_ID_KEY: string = "BUILD_BUILDID";
  public static readonly RELEASE_ID_KEY: string = "RELEASE_RELEASEID";
  public static readonly HOST_KEY: string = "SYSTEM_HOSTTYPE";

  public static readonly ENVIRONMENTID_KEY: string = "RELEASE_ENVIRONMENTID";
  public static readonly ENVIRONMENTDEFID_KEY: string = "RELEASE_DEFINITIONENVIRONMENTID";
}
