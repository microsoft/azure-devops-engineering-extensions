import { TestSummaryItemModel } from "../testresults/TestSummaryItemModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TimeFormatter } from "../helpers/TimeFormatter";
import { TestResultSummary, TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultsHelper } from "../helpers/TestResultsHelper";
import { isNullOrUndefined } from "util";

export class TestResultSummaryViewModel {
  public static readonly MaxSupportedPriority = 2;
  public Duration: string;
  public FailedTests: number;
  public OtherTests: number;
  public PassedTests: number;
  public PassingRate: string;
  public TotalTests: number;
  public Url: string;

  constructor(summaryItemModel: TestSummaryItemModel, summary: TestResultSummary, pipelineConfiguration: PipelineConfiguration, includeOthersInTotal: boolean) {
    if (summaryItemModel != null) {
      this.PassedTests = summaryItemModel.getPassedTestsCount();
      this.FailedTests = summaryItemModel.getFailedTestsCount();
      this.OtherTests = summaryItemModel.getOtherTestsCount();

      this.TotalTests = TestResultsHelper.getTotalTestCountBasedOnUserConfiguration(summaryItemModel.$testCountByOutcome,
        includeOthersInTotal);

      this.PassingRate = TestResultsHelper.getTestOutcomePercentageString(this.PassedTests, this.TotalTests);

      this.Duration = TimeFormatter.FormatDuration(summaryItemModel.$duration);

      this.Url = pipelineConfiguration.getTestTabLink();
    }
    else if (summary != null) {
      const passedAnalysis = summary.aggregatedResultsAnalysis.resultsByOutcome[TestOutcome.Passed];
      const failedAnalysis = summary.aggregatedResultsAnalysis.resultsByOutcome[TestOutcome.Failed];
      this.PassedTests = isNullOrUndefined(passedAnalysis) ? 0 : passedAnalysis.count;
      this.FailedTests = isNullOrUndefined(failedAnalysis) ? 0 : failedAnalysis.count;
      this.TotalTests = summary.aggregatedResultsAnalysis.totalTests;
      this.OtherTests = this.TotalTests - this.PassedTests - this.FailedTests;

      if (!includeOthersInTotal) {
        this.TotalTests -= this.OtherTests;
      }

      this.Duration = TimeFormatter.FormatDurationStr(summary.aggregatedResultsAnalysis.duration);
      this.PassingRate = TestResultsHelper.getTestOutcomePercentageString(this.PassedTests, this.TotalTests);
      this.Url = pipelineConfiguration.getTestTabLink();
    }
  }
}