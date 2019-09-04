import { IPostProcessor } from "./IPostProcessor";
import { Report } from "../model/Report";
import { ReportConfiguration } from "../config/ReportConfiguration";
import { SendMailCondition } from "../config/report/SendMailCondition";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { ITestResultsClient } from "./restclients/ITestResultsClient";
import { TestResultSummary, TestOutcome, TestCaseResult, TestResultsQuery } from "azure-devops-node-api/interfaces/TestInterfaces";
import { isNullOrUndefined } from "util";
import { TcmHelper } from "./tcmproviders/TcmHelper";
import { TestResultsQueryImpl } from "./restclients/AbstractTestResultsClient";
import { EnumUtils } from "../utils/EnumUtils";

export class SendMailConditionProcessor implements IPostProcessor {
  private testResultsClient: ITestResultsClient;
  private readonly TestResultFieldsToQuery: string[] = ["TestCaseReferenceId", "OutcomeConfidence"];

  constructor(testResultsClient: ITestResultsClient) {
    this.testResultsClient = testResultsClient;
  }

  public async processReportAsync(reportConfig: ReportConfiguration, report: Report): Promise<void> {
    var shouldSendMail = false;
    if (!report.$dataMissing) {
      const sendMailCondition = reportConfig.$sendMailCondition;

      shouldSendMail = sendMailCondition == SendMailCondition.Always;
      if (!shouldSendMail) {
        var hasTestFailures = report.hasFailedTests(reportConfig.$reportDataConfiguration.$includeOthersInTotal);
        var hasFailedTasks = report.hasFailedTasks();
        var hasCanceledPhases = report.hasCanceledPhases();
        var hasFailure = hasTestFailures || hasFailedTasks || hasCanceledPhases;

        if ((sendMailCondition == SendMailCondition.OnFailure && hasFailure)
          || (sendMailCondition == SendMailCondition.OnSuccess && !hasFailure)) {
          shouldSendMail = true;
        }
        else if (sendMailCondition == SendMailCondition.OnNewFailuresOnly && hasFailure) {
          // Always treat phase cancellation issues as new failure as we cannot distinguish/compare phase level issues
          // Still compare failed tests and failed tasks where possible to reduce noise
          if (hasCanceledPhases && !hasTestFailures && !hasFailedTasks) {
            shouldSendMail = true;
            console.log(`Has Phase cancellation(s) issues. Treating as new failure.`);
          }
          else {
            console.log(`Looking for new failures, as the user send mail condition is '${EnumUtils.GetMailConditionString(sendMailCondition)}'.`);
            shouldSendMail = !(await this.hasPreviousReleaseGotSameFailuresAsync(report, reportConfig.$pipelineConfiguration, hasTestFailures, hasFailedTasks));
          }
        }
      }
    }

    report.$sendMailConditionSatisfied = shouldSendMail;
  }

  public async hasPreviousReleaseGotSameFailuresAsync(
    report: Report,
    config: PipelineConfiguration,
    hasTestFailures: boolean,
    hasFailedTasks: boolean): Promise<boolean> {

    var hasPrevGotSameFailures = report.hasPrevGotSameFailures();
    if (hasPrevGotSameFailures) {
      return hasPrevGotSameFailures;
    }

    const hasPrevFailedTasks = report.hasPrevFailedTasks();
    if (report.testResultSummary == null) {
      return false;
    }

    if (hasTestFailures) {
      var prevConfig = report.getPrevConfig(config);
      var lastCompletedTestResultSummary = await this.testResultsClient.queryTestResultsReportAsync(prevConfig);

      var failedInCurrent = this.getFailureCountFromSummary(report.testResultSummary);
      var failedinPrev = this.getFailureCountFromSummary(lastCompletedTestResultSummary);

      // Threshold is 10 to decide whether they are same failures
      console.log(`Current Failures Found: '${failedInCurrent}'.`);
      console.log(`Previous Failures Found: '${failedinPrev}'.`);

      var hasSameFailures = failedInCurrent == failedinPrev;
      // No point in moving ahead if number of failures is different
      if (hasSameFailures) {
        var currFailedTestCaseRefIds = await this.fetchFailedTestCaseIdsAsync(config);
        var prevFailedTestCaseRefIds = await this.fetchFailedTestCaseIdsAsync(prevConfig);

        const leftJoin = currFailedTestCaseRefIds.filter(c => !prevFailedTestCaseRefIds.includes(c));
        if (leftJoin.length > 0) {
          console.log(`Difference in Failed Test Reference Ids found between current and prev pipeline.`);
          hasSameFailures = false;
        } else {
          const rightJoin = prevFailedTestCaseRefIds.filter(p => !currFailedTestCaseRefIds.includes(p));
          if (rightJoin.length > 0) {
            console.log(`Difference in Failed Test Reference Ids found between current and prev pipeline.`);
            hasSameFailures = false;
          } else {
            console.log(`Failed Test Reference Ids match. No new failures found.`);
            hasSameFailures = true;
          }
        }
      }
      return hasSameFailures;
    }
    else if (hasFailedTasks && hasPrevFailedTasks) {
      return report.arePrevFailedTasksSame();
    }
    return false;
  }

  private getFailureCountFromSummary(testResultSummary: TestResultSummary): number {
    const failedOutcome = testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[TestOutcome.Failed];
    return !isNullOrUndefined(failedOutcome) ? failedOutcome.count : 0;
  }

  private async fetchFailedTestCaseIdsAsync(pipelineConfig: PipelineConfiguration): Promise<number[]> {
    var testSummary = await this.testResultsClient.getTestResultsDetailsAsync(null, [TestOutcome.Failed], pipelineConfig);
    var resultsToQuery: TestCaseResult[] = [];
    testSummary.resultsForGroup.forEach(r => resultsToQuery.push(...r.results));
    var testCaseIds: number[] = [];

    if (resultsToQuery.length > 0) {
      // API supports only 100 results at a time
      const tasks: Promise<TestResultsQuery>[] = [];
      for (let i = 0, j = resultsToQuery.length; i < j; i += 100) {
        const tempArray = resultsToQuery.slice(i, i + 100);
        let query: TestResultsQuery = new TestResultsQueryImpl();
        query.fields = this.TestResultFieldsToQuery;
        query.results = tempArray;
        tasks.push(this.testResultsClient.getTestResultsByQueryAsync(query));
      }

      const resultQueries = await Promise.all(tasks);
      resultQueries.forEach(rq => {
        let tempIds = rq.results.filter(r => TcmHelper.isTestFlaky(r)).map(r1 => r1.testCaseReferenceId);
        testCaseIds.push(...tempIds);
      });
    }

    return testCaseIds;
  }
}