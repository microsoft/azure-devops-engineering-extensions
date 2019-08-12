import { IDataProvider } from "../IDataProvider";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Report } from "../../model/Report";
import { ITestResultsClient } from "../restclients/ITestResultsClient";
import { TestSummaryGroupModel } from "../../model/testresults/TestSummaryGroupModel";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
import { TestResultDetailsParserForRun } from "../helpers/TestResultDetailsParserForRun";
import { TestOutcomeForPriority } from "../../model/testresults/TestOutcomeForPriority";
import { TestResultDetailsParserForPriority } from "../helpers/TestResultDetailsParserForPriority";
import { PipelineType } from "../../config/pipeline/PipelineType";
import { TestResultsDetails, TestOutcome, AggregatedResultsByOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { TcmHelper } from "./TcmHelper";
import { ReportFactory } from "../../model/ReportFactory";

export class TestSummaryDataProvider implements IDataProvider {

  private testResultsClient: ITestResultsClient;

  constructor(testResultsClient: ITestResultsClient) {
    this.testResultsClient = testResultsClient;
  }

  public async getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report> {
    const report = ReportFactory.createNewReport(pipelineConfig);
    const testSummaryGroups: TestSummaryGroupModel[] = [];

    const testSummaryGroupModelForRun = await this.getTestRunSummaryWithPriorityAsync(pipelineConfig);
    testSummaryGroups.push(testSummaryGroupModelForRun);

    report.testResultSummary = await this.testResultsClient.getTestResultSummaryAsync(true);

    // Hack - above testresultsummary is incomplete - bug filed
    const passedResults = await this.testResultsClient.getTestResultsDetailsAsync("TestRun", [TestOutcome.Passed]);
    const failedResults = await this.testResultsClient.getTestResultsDetailsAsync("TestRun", [TestOutcome.Failed]);
    this.setOutComeData(report, testSummaryGroups, TestOutcome.Passed, passedResults);
    this.setOutComeData(report, testSummaryGroups, TestOutcome.Failed, failedResults);

    if (reportDataConfiguration.$groupTestSummaryBy.includes(GroupTestResultsBy.Priority)) {
      testSummaryGroups.push(await this.getTestSummaryByPriorityAsync());
    }
    report.$testSummaryGroups.push(...testSummaryGroups);
    return report;
  }

  private async getTestSummaryByPriorityAsync(): Promise<TestSummaryGroupModel> {
    const testSummaryItemsByRuns = await this.testResultsClient.getTestResultsDetailsAsync("Priority");

    var testResultDetailsParserForPriority = new TestResultDetailsParserForPriority(testSummaryItemsByRuns);
    const testSummaryByPriority = new TestSummaryGroupModel();
    testSummaryByPriority.groupedBy = GroupTestResultsBy.Priority;
    const summaryItems = testResultDetailsParserForPriority.getSummaryItems();

    testSummaryByPriority.runs.push(...summaryItems);
    return testSummaryByPriority;
  }

  private async getTestRunSummaryWithPriorityAsync(config: PipelineConfiguration): Promise<TestSummaryGroupModel> {
    const testSummaryByRun = new TestSummaryGroupModel();
    testSummaryByRun.groupedBy = GroupTestResultsBy.Run;

    if (config.$pipelineType == PipelineType.Release) {
      const testResultsDetailsByTestRun = await this.testResultsClient.getTestResultsDetailsAsync("TestRun");
      const summaryDataByPriority = await this.getTestSummaryDataByPriorityAsync();

      const summaryByRun = new TestResultDetailsParserForRun(testResultsDetailsByTestRun);
      const summaryItems = await this.getSummaryByRun(summaryByRun, summaryDataByPriority);
      testSummaryByRun.runs.push(...summaryItems);
    }
    return testSummaryByRun;
  }

  private getSummaryByRun(testResultByRun: TestResultDetailsParserForRun, testResultsForPriorityByOutcome: Map<TestOutcomeForPriority, TestResultDetailsParserForPriority>): TestSummaryItemModel[] {
    const summaryItemByRun = testResultByRun.getSummaryItems();

    summaryItemByRun.forEach(summaryItem => {
      testResultsForPriorityByOutcome.forEach((value: TestResultDetailsParserForPriority, supportedTestOutcome: TestOutcomeForPriority) => {
        const resultCountByPriority = value.getTestResultsForRun(Number.parseInt(summaryItem.$id));

        resultCountByPriority.forEach((resultCount: number, priority: number) => {
          if (!summaryItem.$testCountForOutcomeByPriority.has(priority)) {
            summaryItem.$testCountForOutcomeByPriority.set(priority, new Map<TestOutcomeForPriority, number>());
          }

          const testCountByOutcome = summaryItem.$testCountForOutcomeByPriority.get(priority);

          if (!testCountByOutcome.has(supportedTestOutcome)) {
            testCountByOutcome.set(supportedTestOutcome, 0);
          }

          testCountByOutcome.set(supportedTestOutcome, testCountByOutcome.get(supportedTestOutcome) + resultCountByPriority.get(priority));
        });
      });
    });

    return summaryItemByRun;
  }

  private async getTestSummaryDataByPriorityAsync(): Promise<Map<TestOutcomeForPriority, TestResultDetailsParserForPriority>> {
    var outcomeFilters = new Map<TestOutcomeForPriority, TestOutcome[]>();
    outcomeFilters.set(TestOutcomeForPriority.Passed, [TestOutcome.Passed]);
    outcomeFilters.set(TestOutcomeForPriority.Inconclusive, [TestOutcome.Inconclusive]);
    outcomeFilters.set(TestOutcomeForPriority.NotExecuted, [TestOutcome.NotExecuted]);
    outcomeFilters.set(TestOutcomeForPriority.Other, TcmHelper.exceptOutcomes([TestOutcome.Failed, TestOutcome.Passed, TestOutcome.Inconclusive, TestOutcome.NotExecuted]));
    var testResultDetailsForOutcomes = new Map<TestOutcomeForPriority, TestResultDetailsParserForPriority>();

    const outcomeMap = new Map<TestOutcomeForPriority, TestResultsDetails>();
    const keys = Array.from(outcomeFilters.keys());
    for (var i = 0; i < keys.length; i++) {
      const outcome = keys[i];
      const resultsForOutCome = await this.testResultsClient.getTestResultsDetailsAsync("Priority", outcomeFilters.get(outcome));
      outcomeMap.set(outcome, resultsForOutCome);
    }

    outcomeMap.forEach((value: TestResultsDetails, key: TestOutcomeForPriority) => {
      testResultDetailsForOutcomes.set(key, new TestResultDetailsParserForPriority(value));
    });

    return testResultDetailsForOutcomes;
  }

  // HACK
  private setOutComeData(report: Report, summaryGroups: TestSummaryGroupModel[], outcome: TestOutcome, results: TestResultsDetails): void {
    const outcomeObj = new AggregatedResultsByOutcomeImpl();
    outcomeObj.count = 0;
    outcomeObj.outcome = outcome;
    outcomeObj.duration = 0;
    results.resultsForGroup.forEach(resultsForGroup => {

      if (resultsForGroup.results.length > 0) {
        summaryGroups.forEach(sg => {
          sg.runs.forEach(sgr => {
            if (sgr.$id == resultsForGroup.results[0].testRun.id) {
              sgr.$testCountByOutcome.set(outcome, resultsForGroup.results.length);
            }
          });
        });
      }

      outcomeObj.count += resultsForGroup.results.length;
      resultsForGroup.results.forEach(r => {
        outcomeObj.duration += isNaN(r.durationInMs) ? 0 : r.durationInMs;
      });
    });
    report.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[outcome] = outcomeObj;
  }

}

export class AggregatedResultsByOutcomeImpl implements AggregatedResultsByOutcome {
  count?: number;
  duration?: any;
  groupByField?: string;
  groupByValue?: any;
  outcome?: TestOutcome;
  rerunResultCount?: number;
}