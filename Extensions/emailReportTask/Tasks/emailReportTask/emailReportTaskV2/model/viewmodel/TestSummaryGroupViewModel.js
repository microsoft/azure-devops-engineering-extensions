"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSummaryGroupViewModel = exports.TestSummaryGroupViewModelWrapper = void 0;
const TestSummaryItemViewModel_1 = require("./TestSummaryItemViewModel");
const TestResultSummaryViewModel_1 = require("./TestResultSummaryViewModel");
const GroupTestResultsBy_1 = require("../../config/report/GroupTestResultsBy");
class TestSummaryGroupViewModelWrapper {
}
exports.TestSummaryGroupViewModelWrapper = TestSummaryGroupViewModelWrapper;
class TestSummaryGroupViewModel {
    constructor(testSummaryGroup, config, includeOthersInTotal) {
        this.GroupName = this.getDescription(testSummaryGroup.groupedBy);
        this.InitializeSummaryItems(testSummaryGroup, config, includeOthersInTotal);
        this.InitializeSupportedPriorityColumns();
    }
    InitializeSummaryItems(testSummaryGroup, config, includeOthersInTotal) {
        this.SummaryItems = new TestSummaryItemViewModel_1.TestSummaryItemViewModelWrapper();
        this.SummaryItems.TestSummaryItemViewModel = [];
        testSummaryGroup.runs.forEach(testSummaryItem => {
            this.SummaryItems.TestSummaryItemViewModel.push(new TestSummaryItemViewModel_1.TestSummaryItemViewModel(testSummaryGroup.groupedBy, testSummaryItem, config, includeOthersInTotal));
        });
    }
    InitializeSupportedPriorityColumns() {
        this.SupportedPriorityColumns = new Set();
        this.SummaryItems.TestSummaryItemViewModel.forEach(item => item.TestsByPriority.TestInfoByPriorityViewModel.forEach(testsByPriorityVm => {
            if (testsByPriorityVm.Priority <= TestResultSummaryViewModel_1.TestResultSummaryViewModel.MaxSupportedPriority) {
                this.SupportedPriorityColumns.add(testsByPriorityVm.Priority);
            }
        }));
    }
    getDescription(groupedBy) {
        switch (groupedBy) {
            case GroupTestResultsBy_1.GroupTestResultsBy.Priority: return "Priority";
            case GroupTestResultsBy_1.GroupTestResultsBy.Run: return "Test Run";
            default: return "Team";
        }
    }
}
exports.TestSummaryGroupViewModel = TestSummaryGroupViewModel;
//# sourceMappingURL=TestSummaryGroupViewModel.js.map