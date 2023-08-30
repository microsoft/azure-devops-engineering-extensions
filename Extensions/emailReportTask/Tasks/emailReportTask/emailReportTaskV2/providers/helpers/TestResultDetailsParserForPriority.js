"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultDetailsParserForPriority = void 0;
const AbstractTestResultsDetailsParser_1 = require("./AbstractTestResultsDetailsParser");
const TestSummaryItemModel_1 = require("../../model/testresults/TestSummaryItemModel");
const InvalidTestResultDataError_1 = require("../../exceptions/InvalidTestResultDataError");
class TestResultDetailsParserForPriority extends AbstractTestResultsDetailsParser_1.AbstractTestResultsDetailsParser {
    constructor(testResultDetails) {
        super(testResultDetails);
        if (testResultDetails.groupByField.toUpperCase() != "Priority".toUpperCase()) {
            throw new InvalidTestResultDataError_1.InvalidTestResultDataError(`Expected test result group type to be Priority. But found ${testResultDetails.groupByField}`);
        }
    }
    getSummaryItems() {
        const resultsForGroup = this.testResultDetails.resultsForGroup;
        if (resultsForGroup != null && resultsForGroup.length > 0) {
            return resultsForGroup.map(group => {
                var priority = this.getPriority(group.groupByValue);
                var summaryItem = new TestSummaryItemModel_1.TestSummaryItemModel(priority.toString(), priority.toString());
                this.parseBaseData(group, summaryItem);
                return summaryItem;
            });
        }
        return [];
    }
    getGroupByValue(group) {
        return this.getPriority(group.groupByValue).toString();
    }
    getTestResultsForRun(runId) {
        const testResultsByPriority = this.getTestCountByPriorityInTestRun();
        return testResultsByPriority.has(runId) ? testResultsByPriority.get(runId) : new Map();
    }
    getPriority(groupByValue) {
        let priority = Number.parseInt(groupByValue);
        if (priority == null || Number.isNaN(priority)) {
            throw new InvalidTestResultDataError_1.InvalidTestResultDataError(`Expected priority value to be integer in ${groupByValue}`);
        }
        return priority;
    }
    getTestCountByPriorityInTestRun() {
        var testResultsByPriority = new Map();
        this.testResultDetails.resultsForGroup.forEach(testResultsByGroup => {
            var priority = this.getPriority(testResultsByGroup.groupByValue);
            testResultsByGroup.results.forEach(result => {
                if (result.testRun == null) {
                    throw new InvalidTestResultDataError_1.InvalidTestResultDataError(`Test run field is null in Test result object with test id - ${result.id}`);
                }
                const testRunId = Number.parseInt(result.testRun.id);
                if (testRunId == null || Number.isNaN(testRunId)) {
                    throw new InvalidTestResultDataError_1.InvalidTestResultDataError(`Unable to parse test run id to integer in ${result.testRun.id}`);
                }
                if (!testResultsByPriority.has(testRunId)) {
                    testResultsByPriority.set(testRunId, new Map());
                }
                const resultsByPriorityForRun = testResultsByPriority.get(testRunId);
                var testCountByPriority = resultsByPriorityForRun.has(priority) ? resultsByPriorityForRun.get(priority) : 0;
                resultsByPriorityForRun.set(priority, testCountByPriority + 1);
            });
        });
        return testResultsByPriority;
    }
}
exports.TestResultDetailsParserForPriority = TestResultDetailsParserForPriority;
//# sourceMappingURL=TestResultDetailsParserForPriority.js.map