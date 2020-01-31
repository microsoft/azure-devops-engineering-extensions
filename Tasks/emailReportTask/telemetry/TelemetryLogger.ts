import { ReportConfiguration } from "../config/ReportConfiguration";
import { PipelineType } from "../config/pipeline/PipelineType";
import { EnumUtils } from "../utils/EnumUtils";
const { performance } = require('perf_hooks');

export class TelemetryLogger {
  public static readonly TELEMETRY_LINE =
    "##vso[telemetry.publish area=AgentTasks;feature=EmailReportTask]";

  private static instance: TelemetryLogger;
  private static reportConfig: ReportConfiguration;

  /**
   * Formats and sends all telemetry collected to be published
   */
  public static LogTaskConfig(reportConfiguration: ReportConfiguration): void {
    this.reportConfig = reportConfiguration;

    const pipelineConfig = this.reportConfig.$pipelineConfiguration;
    const mailConfig = this.reportConfig.$mailConfiguration;
    const reportDataConfig = this.reportConfig.$reportDataConfiguration;

    let pipelineTypeString: string = "Release";
    let environmentId: number = 0;
    if (pipelineConfig.$pipelineType == PipelineType.Build) {
      pipelineTypeString = "Build";
    } else {
      environmentId = pipelineConfig.$environmentId;
    }

    const groupTestSummary: string[] = reportDataConfig.$groupTestSummaryBy.map(g => EnumUtils.GetGroupTestResultsByString(g));
    let groupTestSummaryString = groupTestSummary[0];
    if (groupTestSummary.length > 0) {
      groupTestSummaryString = groupTestSummary.join(",");
    }

    this.logTelemetry({
      pipelineId: pipelineConfig.$pipelineId,
      pipelineType: pipelineTypeString,
      projectId: pipelineConfig.$projectId,
      projectName: pipelineConfig.$projectName,
      environmentId: environmentId,
      taskConfiguration: {
        sendMailCondition: EnumUtils.GetMailConditionString(this.reportConfig.$sendMailCondition),
        smtpHost: mailConfig.$smtpConfig.$smtpHost,
        smtpUserName: mailConfig.$smtpConfig.$userName,
        enableTLs: mailConfig.$smtpConfig.$enableTLS,
        includeCommits: reportDataConfig.$includeCommits,
        includeOthersInTotal: reportDataConfig.$includeOthersInTotal,
        groupTestSummaryBy: groupTestSummaryString,
        testResultsConfiguration: {
          includeFailedTests: reportDataConfig.$testResultsConfig.$includeFailedTests,
          includeInconclusiveTests: reportDataConfig.$testResultsConfig.$includeInconclusiveTests,
          includeNotExecutedTests: reportDataConfig.$testResultsConfig.$includeNotExecutedTests,
          includeOtherTests: reportDataConfig.$testResultsConfig.$includeOtherTests,
          includePassedTests: reportDataConfig.$testResultsConfig.$includePassedTests,
          maxItemsToShow: reportDataConfig.$testResultsConfig.$maxItemsToShow
        }
      }
    });
  }

  public static LogModulePerf(moduleName: string, timeTaken: number, numRetries: Number = 0) {
    const timeTakenString = timeTaken.toFixed(2);
    if (numRetries < 1) {
      this.logTelemetry({
        "ModuleName": `${moduleName}`,
        "PERF": `${timeTakenString}`
      });
    } else {
      this.logTelemetry({
        "ModuleName": `${moduleName}`,
        "PERF": `${timeTakenString}`,
        "Retries": `${numRetries}`
      });
    }
  }

  /**
   * Publishes an object as a string as telemetry
   * @param telemetryToLog Object to be logged as a string
   */
  private static logTelemetry(telemetryToLog: {}) {
    console.log(
      TelemetryLogger.TELEMETRY_LINE + JSON.stringify(telemetryToLog)
    );
  }

  public static async InvokeWithPerfLogger<T>(executor: () => Promise<T>, executorName: string): Promise<T> {
    const perfStart = performance.now();
    let returnVal: T;
    try {
      returnVal = await executor();
    }
    finally {
      // Log time taken by the dataprovider
      TelemetryLogger.LogModulePerf(executorName, performance.now() - perfStart);
    }
    return returnVal;
  }
}
