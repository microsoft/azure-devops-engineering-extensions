import { IDataProvider } from "../IDataProvider";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Report } from "../../model/Report";
import { ITestResultsClient } from "../restclients/ITestResultsClient";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { TestResultsConfiguration } from "../../config/report/TestResultsConfiguration";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { TestOutcome, TestResultsDetails, TestCaseResult, TestResultsDetailsForGroup, WorkItemReference, ResultDetails } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TcmHelper } from "./TcmHelper";
import { TestResultsGroupModel } from "../../model/testresults/TestResultGroupModel";
import { TestResultModel } from "../../model/testresults/TestResultModel";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { IWorkItemClient } from "../restclients/IWorkItemClient";
import { TestResultDetailsParserFactory } from "../helpers/TestResultDetailsParserFactory";
import { ReportFactory } from "../../model/ReportFactory";
import { AbstractTestResultsDetailsParser } from "../helpers/AbstractTestResultsDetailsParser";
import { isNullOrUndefined } from "util";

export class TestResultsDataProvider implements IDataProvider {

  private testResultsClient: ITestResultsClient;
  private workItemClient: IWorkItemClient;

  constructor(testResultsClient: ITestResultsClient, workItemClient: IWorkItemClient) {
    this.testResultsClient = testResultsClient;
    this.workItemClient = workItemClient;
  }

  public async getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfig: ReportDataConfiguration): Promise<Report> {
    const report = ReportFactory.createNewReport(pipelineConfig);
    // This is to make sure the failing since information is computed before we fetch test results
    await this.testResultsClient.queryTestResultsReportAsync();
    await this.setFilteredTestResults(pipelineConfig, reportDataConfig.$testResultsConfig, report);
    return report;
  }

  private async setFilteredTestResults(config: PipelineConfiguration, testResultsConfiguration: TestResultsConfiguration, report: Report): Promise<void> {
    if (testResultsConfiguration.$includeFailedTests || testResultsConfiguration.$includeOtherTests || testResultsConfiguration.$includePassedTests) {
      const groupBy = testResultsConfiguration.$groupTestResultsBy == GroupTestResultsBy.Run ? "TestRun" : "Priority";
      const includedOutcomes = this.getIncludedOutcomes(testResultsConfiguration);

      const resultIdsToFetch = await this.testResultsClient.getTestResultsDetailsAsync(groupBy, includedOutcomes);

      report.hasFilteredTests = this.filterTestResults(resultIdsToFetch, testResultsConfiguration.$maxItemsToShow);

      const filteredTestResultGroups = await this.getTestResultsWithWorkItems(resultIdsToFetch);

      report.filteredResults = filteredTestResultGroups;
    }
  }

  private async getTestResultsWithWorkItems(resultIdsToFetch: TestResultsDetails): Promise<TestResultsGroupModel[]> {
    const testResultDetailsParser = TestResultDetailsParserFactory.getParser(resultIdsToFetch);

    const filteredTestResultGroups = resultIdsToFetch.resultsForGroup
      .map(resultsForGroup => this.getTestResultsForResultsGroupWithWorkItemsAsync(resultsForGroup, testResultDetailsParser));
    const results = await Promise.all(filteredTestResultGroups);
    return results;
  }

  private async getTestResultsForResultsGroupWithWorkItemsAsync(resultsForGroup: TestResultsDetailsForGroup, parser: AbstractTestResultsDetailsParser): Promise<TestResultsGroupModel> {
    var resultGroup = new TestResultsGroupModel();
    resultGroup.groupName = parser.getGroupByValue(resultsForGroup);

    const bugsRefs: WorkItemReference[] = [];
    const results = await this.getTestResultsWithBugRefs(resultsForGroup, bugsRefs);

    const workItemDictionary = await this.getWorkItemsAsync(bugsRefs);

    results.forEach(result => {
      if (result.associatedBugRefs != null && result.associatedBugRefs.length > 0) {
        result.associatedBugRefs.forEach(workItemReference => {
          result.associatedBugs.push(workItemDictionary.get(Number.parseInt(workItemReference.id)));
        });
      }
    });

    results.forEach(result => {
      if (result.testResult.outcome != null) {
        const testOutcome = TcmHelper.parseOutcome(result.testResult.outcome);
        if (!resultGroup.testResults.has(testOutcome)) {
          resultGroup.testResults.set(testOutcome, []);
        }

        resultGroup.testResults.get(testOutcome).push(result);
      }
      else {
        console.log(`Found test with outcome as null. Test result id ${result.testResult.id} in Test run ${result.testResult.testRun.id}`);
      }
    });
    return resultGroup;
  }

  private async getWorkItemsAsync(bugsRefs: WorkItemReference[]): Promise<Map<number, WorkItem>> {
    const workItemDictionary: Map<number, WorkItem> = new Map<number, WorkItem>();

    if (bugsRefs != null && bugsRefs.length > 0) {
      const workItems: WorkItem[] = await this.workItemClient.getWorkItemsAsync(bugsRefs.map(bugRef => Number.parseInt(bugRef.id)));
      workItems.forEach(workItem => {
        if (workItem.id != null) {
          workItemDictionary.set(workItem.id, workItem);
        }
        else {
          console.log(`Unable to get id for a work item`);
        }
      });
    }

    return workItemDictionary;
  }

  private async getTestResultsWithBugRefs(resultsForGroup: TestResultsDetailsForGroup, bugReferencesInGroup: WorkItemReference[]): Promise<TestResultModel[]> {
    const resultModels: TestResultModel[] = [];
    for (var i = 0; i < resultsForGroup.results.length; i++) {
      const resultIdObj = resultsForGroup.results[i];
      const testResult = await this.testResultsClient.getTestResultById(Number.parseInt(resultIdObj.testRun.id), resultIdObj.id);

      // Remove flaky tests
      if (isNullOrUndefined(testResult) || TcmHelper.isTestFlaky(testResult)) {
        continue;
      }

      const associatedBugRefs = await this.testResultsClient.queryTestResultBugs(testResult.automatedTestName, testResult.id);
      const resultModel = new TestResultModel();
      resultModel.testResult = testResult;
      resultModel.associatedBugRefs = associatedBugRefs;
      resultModels.push(resultModel);
    }
    // let results = resultsForGroup.results
    //     .map(async resultIdObj =>
    //     {
    //         const resultModel = new TestResultModel();

    //         resultModel.testResult = await this.testResultsClient.getTestResultById(Number.parseInt(resultIdObj.testRun.id), resultIdObj.id);

    //         // Remove flaky tests
    //         if (TcmHelper.isTestFlaky(resultModel.testResult))
    //         {
    //             return null;
    //         }

    //         resultModel.associatedBugRefs = await this.testResultsClient.queryTestResultBugs(resultModel.testResult.automatedTestName, resultModel.testResult.id);
    //         return resultModel;
    //     });

    //Remove all null values from array
    //results = results.filter(r => r != null);
    //results.forEach(async result => resultModels.push((await result)));
    resultModels.forEach(result => bugReferencesInGroup.push(...result.associatedBugRefs));
    return resultModels;
  }

  private filterTestResults(resultIdsToFetch: TestResultsDetails, maxItems: number): boolean {
    var hasFiltered = false;
    var remainingItems = maxItems;
    for (let i = 0; i < resultIdsToFetch.resultsForGroup.length; i++) {
      const group = resultIdsToFetch.resultsForGroup[i];
      var currentItemsSize = group.results.length;
      if (currentItemsSize > remainingItems) {
        hasFiltered = true;
        const results: TestCaseResult[] = [];
        results.push(...group.results);
        group.results = results.splice(0, remainingItems);
        break;
      }
      remainingItems -= group.results.length;
    }

    resultIdsToFetch.resultsForGroup = resultIdsToFetch.resultsForGroup.filter(group => group.results.length > 0);
    return hasFiltered;
  }

  private getIncludedOutcomes(testResultsConfiguration: TestResultsConfiguration): TestOutcome[] {
    const includedOutcomes: TestOutcome[] = [];
    if (testResultsConfiguration.$includeFailedTests) {
      includedOutcomes.push(TestOutcome.Failed);
    }

    if (testResultsConfiguration.$includeOtherTests) {
      includedOutcomes.push(...TcmHelper.exceptOutcomes([TestOutcome.Failed, TestOutcome.Passed]));
    }

    if (testResultsConfiguration.$includePassedTests) {
      includedOutcomes.push(TestOutcome.Passed);
    }

    return includedOutcomes;
  }
}