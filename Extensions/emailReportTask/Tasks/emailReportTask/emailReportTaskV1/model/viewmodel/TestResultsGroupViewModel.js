"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultsGroupViewModel = exports.TestResultsGroupViewModelWrapper = void 0;
const TestResultViewModel_1 = require("./TestResultViewModel");
const GroupTestResultsBy_1 = require("../../config/report/GroupTestResultsBy");
const DisplayNameHelper_1 = require("../../utils/DisplayNameHelper");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const TcmHelper_1 = require("../../providers/tcmproviders/TcmHelper");
class TestResultsGroupViewModelWrapper {
}
exports.TestResultsGroupViewModelWrapper = TestResultsGroupViewModelWrapper;
class TestResultsGroupViewModel {
    constructor(resultsGroupModel, reportConfig) {
        this.FailedTests = new TestResultViewModel_1.TestResultViewModelWrapper();
        this.OtherTests = new TestResultViewModel_1.TestResultViewModelWrapper();
        this.PassedTests = new TestResultViewModel_1.TestResultViewModelWrapper();
        this.setGroupName(resultsGroupModel, reportConfig);
        this.FailedTests.TestResultViewModel = this.getTestResultViewModels(resultsGroupModel, reportConfig.$pipelineConfiguration, [TestInterfaces_1.TestOutcome.Failed]);
        this.PassedTests.TestResultViewModel = this.getTestResultViewModels(resultsGroupModel, reportConfig.$pipelineConfiguration, [TestInterfaces_1.TestOutcome.Passed]);
        this.OtherTests.TestResultViewModel = this.getTestResultViewModels(resultsGroupModel, reportConfig.$pipelineConfiguration, TcmHelper_1.TcmHelper.exceptOutcomes([TestInterfaces_1.TestOutcome.Failed, TestInterfaces_1.TestOutcome.Passed]));
    }
    setGroupName(resultsGroupModel, reportConfig) {
        var groupTestResultsBy = reportConfig.$reportDataConfiguration.$testResultsConfig.$groupTestResultsBy;
        this.GroupName = groupTestResultsBy == GroupTestResultsBy_1.GroupTestResultsBy.Priority ?
            DisplayNameHelper_1.DisplayNameHelper.getPriorityDisplayName(resultsGroupModel.groupName) :
            resultsGroupModel.groupName;
    }
    getTestResultViewModels(resultsGroupModel, config, testOutcomes) {
        return this.getTestResultsByOutcomes(resultsGroupModel, testOutcomes)
            .map(result => new TestResultViewModel_1.TestResultViewModel(result, config));
    }
    getTestResultsByOutcomes(source, outcomes) {
        const testResults = [];
        outcomes.forEach(outcome => {
            if (source.testResults.has(outcome)) {
                testResults.push(...source.testResults.get(outcome));
            }
        });
        return testResults;
    }
}
exports.TestResultsGroupViewModel = TestResultsGroupViewModel;
//# sourceMappingURL=TestResultsGroupViewModel.js.map