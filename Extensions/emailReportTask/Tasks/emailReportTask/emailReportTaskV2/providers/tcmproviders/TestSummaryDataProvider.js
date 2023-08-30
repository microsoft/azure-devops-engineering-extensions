"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSummaryDataProvider = void 0;
const TestSummaryGroupModel_1 = require("../../model/testresults/TestSummaryGroupModel");
const GroupTestResultsBy_1 = require("../../config/report/GroupTestResultsBy");
const TestResultDetailsParserForRun_1 = require("../helpers/TestResultDetailsParserForRun");
const TestOutcomeForPriority_1 = require("../../model/testresults/TestOutcomeForPriority");
const TestResultDetailsParserForPriority_1 = require("../helpers/TestResultDetailsParserForPriority");
const PipelineType_1 = require("../../config/pipeline/PipelineType");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const TcmHelper_1 = require("./TcmHelper");
const ReportFactory_1 = require("../../model/ReportFactory");
class TestSummaryDataProvider {
    constructor(testResultsClient) {
        this.testResultsClient = testResultsClient;
    }
    getReportDataAsync(pipelineConfig, reportDataConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = ReportFactory_1.ReportFactory.createNewReport(pipelineConfig);
            const testSummaryGroups = [];
            const testSummaryGroupModelForRun = yield this.getTestRunSummaryWithPriorityAsync(pipelineConfig);
            testSummaryGroups.push(testSummaryGroupModelForRun);
            report.testResultSummary = yield this.testResultsClient.getTestResultSummaryAsync(true);
            // Hack - above testresultsummary is incomplete - bug filed
            //const passedResults = await this.testResultsClient.getTestResultsDetailsAsync("TestRun", [TestOutcome.Passed]);
            //const failedResults = await this.testResultsClient.getTestResultsDetailsAsync("TestRun", [TestOutcome.Failed]);
            //this.setOutComeData(report, testSummaryGroups, TestOutcome.Passed, passedResults);
            //this.setOutComeData(report, testSummaryGroups, TestOutcome.Failed, failedResults);
            if (reportDataConfiguration.$groupTestSummaryBy.includes(GroupTestResultsBy_1.GroupTestResultsBy.Priority)) {
                testSummaryGroups.push(yield this.getTestSummaryByPriorityAsync());
            }
            report.$testSummaryGroups.push(...testSummaryGroups);
            return report;
        });
    }
    getTestSummaryByPriorityAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const testSummaryItemsByRuns = yield this.testResultsClient.getTestResultsDetailsAsync("Priority");
            var testResultDetailsParserForPriority = new TestResultDetailsParserForPriority_1.TestResultDetailsParserForPriority(testSummaryItemsByRuns);
            const testSummaryByPriority = new TestSummaryGroupModel_1.TestSummaryGroupModel();
            testSummaryByPriority.groupedBy = GroupTestResultsBy_1.GroupTestResultsBy.Priority;
            const summaryItems = testResultDetailsParserForPriority.getSummaryItems();
            testSummaryByPriority.runs.push(...summaryItems);
            return testSummaryByPriority;
        });
    }
    getTestRunSummaryWithPriorityAsync(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const testSummaryByRun = new TestSummaryGroupModel_1.TestSummaryGroupModel();
            testSummaryByRun.groupedBy = GroupTestResultsBy_1.GroupTestResultsBy.Run;
            if (config.$pipelineType == PipelineType_1.PipelineType.Release) {
                const testResultsDetailsByTestRun = yield this.testResultsClient.getTestResultsDetailsAsync("TestRun");
                const summaryDataByPriority = yield this.getTestSummaryDataByPriorityAsync();
                const summaryByRun = new TestResultDetailsParserForRun_1.TestResultDetailsParserForRun(testResultsDetailsByTestRun);
                const summaryItems = yield this.getSummaryByRun(summaryByRun, summaryDataByPriority);
                testSummaryByRun.runs.push(...summaryItems);
            }
            return testSummaryByRun;
        });
    }
    getSummaryByRun(testResultByRun, testResultsForPriorityByOutcome) {
        const summaryItemByRun = testResultByRun.getSummaryItems();
        summaryItemByRun.forEach(summaryItem => {
            testResultsForPriorityByOutcome.forEach((value, supportedTestOutcome) => {
                const resultCountByPriority = value.getTestResultsForRun(Number.parseInt(summaryItem.$id));
                resultCountByPriority.forEach((resultCount, priority) => {
                    if (!summaryItem.$testCountForOutcomeByPriority.has(priority)) {
                        summaryItem.$testCountForOutcomeByPriority.set(priority, new Map());
                    }
                    const testCountByOutcome = summaryItem.$testCountForOutcomeByPriority.get(priority);
                    if (!testCountByOutcome.has(supportedTestOutcome)) {
                        testCountByOutcome.set(supportedTestOutcome, 0);
                    }
                    testCountByOutcome.set(supportedTestOutcome, testCountByOutcome.get(supportedTestOutcome) + resultCountByPriority.get(priority));
                });
            });
        });
        return summaryItemByRun;
    }
    getTestSummaryDataByPriorityAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            var outcomeFilters = new Map();
            outcomeFilters.set(TestOutcomeForPriority_1.TestOutcomeForPriority.Passed, [TestInterfaces_1.TestOutcome.Passed]);
            outcomeFilters.set(TestOutcomeForPriority_1.TestOutcomeForPriority.Inconclusive, [TestInterfaces_1.TestOutcome.Inconclusive]);
            outcomeFilters.set(TestOutcomeForPriority_1.TestOutcomeForPriority.NotExecuted, [TestInterfaces_1.TestOutcome.NotExecuted]);
            outcomeFilters.set(TestOutcomeForPriority_1.TestOutcomeForPriority.Other, TcmHelper_1.TcmHelper.exceptOutcomes([TestInterfaces_1.TestOutcome.Failed, TestInterfaces_1.TestOutcome.Passed, TestInterfaces_1.TestOutcome.Inconclusive, TestInterfaces_1.TestOutcome.NotExecuted]));
            var testResultDetailsForOutcomes = new Map();
            const outcomeMap = new Map();
            const keys = Array.from(outcomeFilters.keys());
            for (var i = 0; i < keys.length; i++) {
                const outcome = keys[i];
                const resultsForOutCome = yield this.testResultsClient.getTestResultsDetailsAsync("Priority", outcomeFilters.get(outcome));
                outcomeMap.set(outcome, resultsForOutCome);
            }
            outcomeMap.forEach((value, key) => {
                testResultDetailsForOutcomes.set(key, new TestResultDetailsParserForPriority_1.TestResultDetailsParserForPriority(value));
            });
            return testResultDetailsForOutcomes;
        });
    }
}
exports.TestSummaryDataProvider = TestSummaryDataProvider;
// export class AggregatedResultsByOutcomeImpl implements AggregatedResultsByOutcome {
//   count?: number;
//   duration?: any;
//   groupByField?: string;
//   groupByValue?: any;
//   outcome?: TestOutcome;
//   rerunResultCount?: number;
// }
//# sourceMappingURL=TestSummaryDataProvider.js.map