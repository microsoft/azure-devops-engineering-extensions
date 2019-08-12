export class TaskConstants
{
  public static readonly SUBJECT_INPUTKEY = "subject";
  public static readonly SENDMAILCONDITION_INPUTKEY = "sendMailConditionConfig";
  public static readonly INCLUDECOMMITS_INPUTKEY = "includeCommits";
  public static readonly GROUPTESTRESULTSBY_INPUTKEY = "groupTestResultsBy";
  public static readonly INCLUDEOTHERSINTOTAL_INPUTKEY = "includeOthersInTotal";
  public static readonly MAXTESTFAILURESTOSHOW_INPUTKEY = "maxTestFailuresToShow";
  public static readonly GROUPTESTSUMMARYBY_INPUTKEY = "groupTestSummaryByStr";
  public static readonly INCLUDERESULTS_INPUTKEY = "includeResultsStr";
  public static readonly TOADDRESS_INPUTKEY = "toAddress";
  public static readonly CCADDRESS_INPUTKEY = "ccAddress";
  public static readonly INCLUDEINTO_INPUTKEY = "includeInToSectionStr";
  public static readonly INCLUDEINCC_INPUTKEY = "includeInCcSectionStr";
  public static readonly SMTPCONNECTION_INPUTKEY = "smtpConnectionEndpoint";
  public static readonly ENABLESSL_INPUTKEY = "enableSSLOnSmtpConnection";
  public static readonly USEPREVENV_INPUTKEY = "usePreviousEnvironment";
  public static readonly DEFAULTDOMAIN_INPUTKEY = "defaultDomain";

  public static readonly TEAM_FOUNDATION_KEY: string =
  "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
  public static readonly VSS_CONNECTION_KEY: string = "SYSTEMVSSCONNECTION";
  public static readonly ACCESS_PARAMETER: string = "ACCESSTOKEN";
  public static readonly REPOSITORY_KEY: string = "BUILD_REPOSITORY_NAME";
  public static readonly PULL_REQUEST_ID_KEYS: string[] = [
  "SYSTEM_PULLREQUEST_PULLREQUESTID",
  "BUILD_PULLREQUEST_ID"
  ];
  public static readonly PROJECTNAME_KEY: string = "SYSTEM_TEAMPROJECT";
  public static readonly PROJECTID_KEY: string = "SYSTEM_TEAMPROJECTID";
  public static readonly BUILD_ID_KEY: string = "BUILD_BUILDID";   
  public static readonly RELEASE_ID_KEY: string = "RELEASE_RELEASEID";
  public static readonly HOST_KEY: string = "SYSTEM_HOSTTYPE";

  public static readonly ENVIRONMENTID_KEY: string = "RELEASE_ENVIRONMENTID";
  public static readonly ENVIRONMENTDEFID_KEY: string = "RELEASE_DEFINITIONENVIRONMENTID";
}
