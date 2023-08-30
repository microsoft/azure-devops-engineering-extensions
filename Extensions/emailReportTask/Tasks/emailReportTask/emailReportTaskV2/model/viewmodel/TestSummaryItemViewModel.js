"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSummaryItemViewModel = exports.TestSummaryItemViewModelWrapper = void 0;
const TestResultSummaryViewModel_1 = require("./TestResultSummaryViewModel");
const TestInfoByPriorityViewModel_1 = require("./TestInfoByPriorityViewModel");
const GroupTestResultsBy_1 = require("../../config/report/GroupTestResultsBy");
class TestSummaryItemViewModelWrapper {
}
exports.TestSummaryItemViewModelWrapper = TestSummaryItemViewModelWrapper;
class TestSummaryItemViewModel extends TestResultSummaryViewModel_1.TestResultSummaryViewModel {
    constructor(groupedBy, summaryItem, config, includeOthersInTotal) {
        super(summaryItem, null, config, includeOthersInTotal);
        this.TestsByPriority = new TestInfoByPriorityViewModel_1.TestInfoByPriorityViewModelWrapper();
        this.Name = (groupedBy == GroupTestResultsBy_1.GroupTestResultsBy.Priority) ?
            this.getDisplayName(summaryItem.$name) :
            summaryItem.$name;
        this.setupPriorityData(summaryItem, includeOthersInTotal);
    }
    setupPriorityData(summaryItem, includeOthersInTotal) {
        this.TestsByPriority.TestInfoByPriorityViewModel = [];
        const testCountForOutcomeByPriority = summaryItem.$testCountForOutcomeByPriority;
        testCountForOutcomeByPriority.forEach((value, priority) => {
            if (priority <= TestResultSummaryViewModel_1.TestResultSummaryViewModel.MaxSupportedPriority) {
                this.TestsByPriority.TestInfoByPriorityViewModel.push(new TestInfoByPriorityViewModel_1.TestInfoByPriorityViewModel(priority, value, includeOthersInTotal));
            }
        });
    }
    getDisplayName(priority) {
        const priorityInt = Number.parseInt(priority);
        if (!isNaN(priorityInt) && priorityInt == 255) {
            return "Priority unspecified";
        }
        return `Priority: ${priority}`;
    }
}
exports.TestSummaryItemViewModel = TestSummaryItemViewModel;
//# sourceMappingURL=TestSummaryItemViewModel.js.map