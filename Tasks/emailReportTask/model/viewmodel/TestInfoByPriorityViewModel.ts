import { TestOutcomeForPriority } from "../testresults/TestOutcomeForPriority";
import { TestResultsHelper } from "../helpers/TestResultsHelper";

export class TestInfoByPriorityViewModelWrapper {
  public TestInfoByPriorityViewModel: TestInfoByPriorityViewModel[];
}

export class TestInfoByPriorityViewModel {
  public Priority: number;
  public PassingRate: string;
  public TestCount: number;

  constructor(priority: number,
    testCountByOutcome: Map<TestOutcomeForPriority, number>,
    includeOthersInTotal: boolean) {
    this.Priority = priority;
    this.TestCount = TestResultsHelper.getTotalTestCountBasedOnUserConfigurationPriority(
      testCountByOutcome, includeOthersInTotal);
    if (this.TestCount > 0) {
      var passingTests = this.getPassingTestCountByOutcome(testCountByOutcome);
      this.PassingRate = TestResultsHelper.getTestOutcomePercentageString(passingTests, this.TestCount);
    }
  }

  private getPassingTestCountByOutcome(testCountByOutcome: Map<TestOutcomeForPriority, number>): number {
    return testCountByOutcome.has(TestOutcomeForPriority.Passed)
      ? testCountByOutcome.get(TestOutcomeForPriority.Passed)
      : 0;
  }
}