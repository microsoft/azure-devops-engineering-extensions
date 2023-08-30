"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestInfoByPriorityViewModel = exports.TestInfoByPriorityViewModelWrapper = void 0;
const TestOutcomeForPriority_1 = require("../testresults/TestOutcomeForPriority");
const TestResultsHelper_1 = require("../helpers/TestResultsHelper");
class TestInfoByPriorityViewModelWrapper {
}
exports.TestInfoByPriorityViewModelWrapper = TestInfoByPriorityViewModelWrapper;
class TestInfoByPriorityViewModel {
    constructor(priority, testCountByOutcome, includeOthersInTotal) {
        this.Priority = priority;
        this.TestCount = TestResultsHelper_1.TestResultsHelper.getTotalTestCountBasedOnUserConfigurationPriority(testCountByOutcome, includeOthersInTotal);
        if (this.TestCount > 0) {
            var passingTests = this.getPassingTestCountByOutcome(testCountByOutcome);
            this.PassingRate = TestResultsHelper_1.TestResultsHelper.getTestOutcomePercentageString(passingTests, this.TestCount);
        }
    }
    getPassingTestCountByOutcome(testCountByOutcome) {
        return testCountByOutcome.has(TestOutcomeForPriority_1.TestOutcomeForPriority.Passed)
            ? testCountByOutcome.get(TestOutcomeForPriority_1.TestOutcomeForPriority.Passed)
            : 0;
    }
}
exports.TestInfoByPriorityViewModel = TestInfoByPriorityViewModel;
//# sourceMappingURL=TestInfoByPriorityViewModel.js.map