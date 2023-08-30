"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunInfo = exports.TestResultDetailsParserForRun = void 0;
const AbstractTestResultsDetailsParser_1 = require("./AbstractTestResultsDetailsParser");
const TestSummaryItemModel_1 = require("../../model/testresults/TestSummaryItemModel");
const InvalidTestResultDataError_1 = require("../../exceptions/InvalidTestResultDataError");
class TestResultDetailsParserForRun extends AbstractTestResultsDetailsParser_1.AbstractTestResultsDetailsParser {
    constructor(testResultDetails) {
        super(testResultDetails);
        if (testResultDetails.groupByField.toUpperCase() != "TestRun".toUpperCase()) {
            throw new InvalidTestResultDataError_1.InvalidTestResultDataError(`Expected test result group type to be Priority. But found ${testResultDetails.groupByField}`);
        }
    }
    getSummaryItems() {
        return this.testResultDetails.resultsForGroup.map(r => this.getTestRunSummaryInfo(r));
    }
    getGroupByValue(group) {
        const runinfo = this.readGroupByValue(group);
        return runinfo.name;
    }
    getTestRunSummaryInfo(resultsForGroup) {
        console.log(`Getting Test summary data for test run - ${resultsForGroup.groupByValue.name}`);
        const runinfo = this.readGroupByValue(resultsForGroup);
        var summaryItem = new TestSummaryItemModel_1.TestSummaryItemModel(runinfo.name == null ? runinfo.id.toString() : runinfo.name, runinfo.id.toString());
        this.parseBaseData(resultsForGroup, summaryItem);
        return summaryItem;
    }
    readGroupByValue(resultsForGroup) {
        const runinfo = new TestRunInfo();
        runinfo.id = resultsForGroup.groupByValue.id;
        runinfo.name = resultsForGroup.groupByValue.name;
        return runinfo;
    }
}
exports.TestResultDetailsParserForRun = TestResultDetailsParserForRun;
class TestRunInfo {
}
exports.TestRunInfo = TestRunInfo;
//# sourceMappingURL=TestResultDetailsParserForRun.js.map