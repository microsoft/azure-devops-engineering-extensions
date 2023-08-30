"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultSummaryViewModel = void 0;
const TimeFormatter_1 = require("../helpers/TimeFormatter");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const TestResultsHelper_1 = require("../helpers/TestResultsHelper");
const util_1 = require("util");
class TestResultSummaryViewModel {
    constructor(summaryItemModel, summary, pipelineConfiguration, includeOthersInTotal) {
        if (summaryItemModel != null) {
            this.PassedTests = summaryItemModel.getPassedTestsCount();
            this.FailedTests = summaryItemModel.getFailedTestsCount();
            this.OtherTests = summaryItemModel.getOtherTestsCount();
            this.TotalTests = TestResultsHelper_1.TestResultsHelper.getTotalTestCountBasedOnUserConfiguration(summaryItemModel.$testCountByOutcome, includeOthersInTotal);
            this.PassingRate = TestResultsHelper_1.TestResultsHelper.getTestOutcomePercentageString(this.PassedTests, this.TotalTests);
            this.Duration = TimeFormatter_1.TimeFormatter.FormatDuration(summaryItemModel.$duration);
            this.Url = pipelineConfiguration.getTestTabLink();
        }
        else if (summary != null) {
            const passedAnalysis = summary.aggregatedResultsAnalysis.resultsByOutcome[TestInterfaces_1.TestOutcome.Passed];
            const failedAnalysis = summary.aggregatedResultsAnalysis.resultsByOutcome[TestInterfaces_1.TestOutcome.Failed];
            this.PassedTests = util_1.isNullOrUndefined(passedAnalysis) ? 0 : passedAnalysis.count;
            this.FailedTests = util_1.isNullOrUndefined(failedAnalysis) ? 0 : failedAnalysis.count;
            this.TotalTests = summary.aggregatedResultsAnalysis.totalTests;
            this.OtherTests = this.TotalTests - this.PassedTests - this.FailedTests;
            if (!includeOthersInTotal) {
                this.TotalTests -= this.OtherTests;
            }
            this.Duration = TimeFormatter_1.TimeFormatter.FormatDurationStr(summary.aggregatedResultsAnalysis.duration);
            this.PassingRate = TestResultsHelper_1.TestResultsHelper.getTestOutcomePercentageString(this.PassedTests, this.TotalTests);
            this.Url = pipelineConfiguration.getTestTabLink();
        }
    }
}
exports.TestResultSummaryViewModel = TestResultSummaryViewModel;
TestResultSummaryViewModel.MaxSupportedPriority = 2;
//# sourceMappingURL=TestResultSummaryViewModel.js.map