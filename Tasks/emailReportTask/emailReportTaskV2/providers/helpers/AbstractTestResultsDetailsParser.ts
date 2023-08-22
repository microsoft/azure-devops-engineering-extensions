import { TestResultsDetails, TestResultsDetailsForGroup, AggregatedResultsByOutcome, TestOutcome, TestCaseResult } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
import { isNullOrUndefined } from "util";
import { TimeFormatter } from "../../model/helpers/TimeFormatter";

export abstract class AbstractTestResultsDetailsParser {

  protected testResultDetails: TestResultsDetails;

  constructor(testResultDetails: TestResultsDetails) {
    this.testResultDetails = testResultDetails;
  }

  public abstract getSummaryItems(): Array<TestSummaryItemModel>;

  public abstract getGroupByValue(group: TestResultsDetailsForGroup): string;

  /// <summary>
  /// Get Duration, TotalTests & test count by outcome
  /// Calculating total duration, as the tcm data has duration by test outcome only.
  /// </summary>
  protected parseBaseData(resultsForGroup: TestResultsDetailsForGroup, summaryItem: TestSummaryItemModel): void {
    let duration: number = 0;
    for (let item in TestOutcome) {
      if (!isNaN(Number(item))) {
        const resultsByOutCome = resultsForGroup.resultsCountByOutcome[Number(item)];
        if (!isNullOrUndefined(resultsByOutCome)) {
          summaryItem.$testCountByOutcome.set(resultsByOutCome.outcome, resultsByOutCome.count);
          duration += TimeFormatter.ConvertTimeStringToMilliSeconds(resultsByOutCome.duration);
        }
      }
    }

    // // HACK - SHould get data directly from resultsGroup.resultsCountByOutcome - but that data is coming wrong
    // resultsForGroup.results.forEach(r => {
    //   duration += isNaN(r.durationInMs) ? 0 : r.durationInMs;
    // });

    summaryItem.$duration = duration;
    summaryItem.$totalTestCount = resultsForGroup.results.length;
  }

  // // HACK
  // private isMatch(result: TestCaseResult, outcome: TestOutcome, outcomeString: string): boolean {
  //   return (!isNullOrUndefined(result.outcome) && result.outcome == outcome.toString() && outcomeString == result.outcome.toLowerCase());
  // }
}