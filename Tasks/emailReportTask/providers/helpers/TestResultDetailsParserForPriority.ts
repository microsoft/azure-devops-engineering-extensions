import { AbstractTestResultsDetailsParser } from "./AbstractTestResultsDetailsParser";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
import { TestResultsDetailsForGroup, TestResultsDetails } from "azure-devops-node-api/interfaces/TestInterfaces";
import { InvalidTestResultDataError } from "../../exceptions/InvalidTestResultDataError";

export class TestResultDetailsParserForPriority extends AbstractTestResultsDetailsParser {

  constructor(testResultDetails: TestResultsDetails) {
    super(testResultDetails);
    if (testResultDetails.groupByField.toUpperCase() != "Priority".toUpperCase()) {
      throw new InvalidTestResultDataError(`Expected test result group type to be Priority. But found ${testResultDetails.groupByField}`);
    }
  }

  public getSummaryItems(): TestSummaryItemModel[] {
    const resultsForGroup = this.testResultDetails.resultsForGroup;
    if (resultsForGroup != null && resultsForGroup.length > 0) {
      return resultsForGroup.map(group => {
        var priority = this.getPriority(group.groupByValue);
        var summaryItem = new TestSummaryItemModel(priority.toString(), priority.toString());

        this.parseBaseData(group, summaryItem);
        return summaryItem;
      });
    }
    return [];
  }

  public getGroupByValue(group: TestResultsDetailsForGroup): string {
    return this.getPriority(group.groupByValue).toString();
  }

  public getTestResultsForRun(runId: number): Map<number, number> {
    const testResultsByPriority: Map<number, Map<number, number>> = this.getTestCountByPriorityInTestRun();
    return testResultsByPriority.has(runId) ? testResultsByPriority.get(runId) : new Map<number, number>();
  }

  private getPriority(groupByValue: any): number {
    let priority: number = Number.parseInt(groupByValue as string);
    if (priority == null || priority == NaN) {
      throw new InvalidTestResultDataError(`Expected priority value to be integer in ${groupByValue}`);
    }
    return priority;
  }

  private getTestCountByPriorityInTestRun(): Map<number, Map<number, number>> {
    var testResultsByPriority = new Map<number, Map<number, number>>();

    this.testResultDetails.resultsForGroup.forEach(testResultsByGroup => {
      var priority = this.getPriority(testResultsByGroup.groupByValue);

      testResultsByGroup.results.forEach(result => {
        if (result.testRun == null) {
          throw new InvalidTestResultDataError(`Test run field is null in Test result object with test id - ${result.id}`);
        }

        const testRunId = Number.parseInt(result.testRun.id);
        if (testRunId == null || testRunId == NaN) {
          throw new InvalidTestResultDataError(`Unable to parse test run id to integer in ${result.testRun.id}`);
        }

        if (!testResultsByPriority.has(testRunId)) {
          testResultsByPriority.set(testRunId, new Map<number, number>());
        }

        const resultsByPriorityForRun = testResultsByPriority.get(testRunId);
        var testCountByPriority = resultsByPriorityForRun.has(priority) ? resultsByPriorityForRun.get(priority) : 0;

        resultsByPriorityForRun.set(priority, testCountByPriority + 1);
      });
    });

    return testResultsByPriority;
  }

}