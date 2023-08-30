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
exports.TestResultsDataProvider = void 0;
const GroupTestResultsBy_1 = require("../../config/report/GroupTestResultsBy");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const TcmHelper_1 = require("./TcmHelper");
const TestResultGroupModel_1 = require("../../model/testresults/TestResultGroupModel");
const TestResultModel_1 = require("../../model/testresults/TestResultModel");
const TestResultDetailsParserFactory_1 = require("../helpers/TestResultDetailsParserFactory");
const ReportFactory_1 = require("../../model/ReportFactory");
const util_1 = require("util");
class TestResultsDataProvider {
    constructor(testResultsClient, workItemClient) {
        this.testResultsClient = testResultsClient;
        this.workItemClient = workItemClient;
    }
    getReportDataAsync(pipelineConfig, reportDataConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = ReportFactory_1.ReportFactory.createNewReport(pipelineConfig);
            // This is to make sure the failing since information is computed before we fetch test results
            yield this.testResultsClient.queryTestResultsReportAsync();
            yield this.setFilteredTestResults(pipelineConfig, reportDataConfig.$testResultsConfig, report);
            return report;
        });
    }
    setFilteredTestResults(config, testResultsConfiguration, report) {
        return __awaiter(this, void 0, void 0, function* () {
            if (testResultsConfiguration.$includeFailedTests || testResultsConfiguration.$includeOtherTests || testResultsConfiguration.$includePassedTests) {
                const groupBy = testResultsConfiguration.$groupTestResultsBy == GroupTestResultsBy_1.GroupTestResultsBy.Run ? "TestRun" : "Priority";
                const includedOutcomes = this.getIncludedOutcomes(testResultsConfiguration);
                const resultIdsToFetch = yield this.testResultsClient.getTestResultsDetailsAsync(groupBy, includedOutcomes);
                report.hasFilteredTests = this.filterTestResults(resultIdsToFetch, testResultsConfiguration.$maxItemsToShow);
                const filteredTestResultGroups = yield this.getTestResultsWithWorkItems(resultIdsToFetch);
                report.filteredResults = filteredTestResultGroups;
            }
        });
    }
    getTestResultsWithWorkItems(resultIdsToFetch) {
        return __awaiter(this, void 0, void 0, function* () {
            const testResultDetailsParser = TestResultDetailsParserFactory_1.TestResultDetailsParserFactory.getParser(resultIdsToFetch);
            const filteredTestResultGroups = resultIdsToFetch.resultsForGroup
                .map(resultsForGroup => this.getTestResultsForResultsGroupWithWorkItemsAsync(resultsForGroup, testResultDetailsParser));
            const results = yield Promise.all(filteredTestResultGroups);
            return results;
        });
    }
    getTestResultsForResultsGroupWithWorkItemsAsync(resultsForGroup, parser) {
        return __awaiter(this, void 0, void 0, function* () {
            var resultGroup = new TestResultGroupModel_1.TestResultsGroupModel();
            resultGroup.groupName = parser.getGroupByValue(resultsForGroup);
            const bugsRefs = [];
            const results = yield this.getTestResultsWithBugRefs(resultsForGroup, bugsRefs);
            try {
                const workItemDictionary = yield this.getWorkItemsAsync(bugsRefs);
                results.forEach(result => {
                    if (result.associatedBugRefs != null && result.associatedBugRefs.length > 0) {
                        result.associatedBugRefs.forEach(workItemReference => {
                            result.associatedBugs.push(workItemDictionary.get(Number.parseInt(workItemReference.id)));
                        });
                    }
                });
            }
            catch (ex) {
                // ignore
                console.warn(`Error while fetching workitems for bugrefs: ${bugsRefs.map(b => b.id)}`);
            }
            results.forEach(result => {
                if (result.testResult.outcome != null) {
                    const testOutcome = TcmHelper_1.TcmHelper.parseOutcome(result.testResult.outcome);
                    if (!resultGroup.testResults.has(testOutcome)) {
                        resultGroup.testResults.set(testOutcome, []);
                    }
                    resultGroup.testResults.get(testOutcome).push(result);
                }
                else {
                    console.log(`Found test with outcome as null. Test result id ${result.testResult.id} in Test run ${result.testResult.testRun.id}`);
                }
            });
            return resultGroup;
        });
    }
    getWorkItemsAsync(bugsRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            const workItemDictionary = new Map();
            if (bugsRefs != null && bugsRefs.length > 0) {
                const workItems = yield this.workItemClient.getWorkItemsAsync(bugsRefs.map(bugRef => Number.parseInt(bugRef.id)));
                workItems.forEach(workItem => {
                    if (workItem.id != null) {
                        workItemDictionary.set(workItem.id, workItem);
                    }
                    else {
                        console.log(`Unable to get id for a work item`);
                    }
                });
            }
            return workItemDictionary;
        });
    }
    getTestResultsWithBugRefs(resultsForGroup, bugReferencesInGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultModels = [];
            for (var i = 0; i < resultsForGroup.results.length; i++) {
                const resultIdObj = resultsForGroup.results[i];
                const testResult = yield this.testResultsClient.getTestResultById(Number.parseInt(resultIdObj.testRun.id), resultIdObj.id);
                // Remove flaky tests
                if (util_1.isNullOrUndefined(testResult) || TcmHelper_1.TcmHelper.isTestFlaky(testResult)) {
                    continue;
                }
                const associatedBugRefs = yield this.testResultsClient.queryTestResultBugs(testResult.automatedTestName, testResult.id);
                const resultModel = new TestResultModel_1.TestResultModel();
                resultModel.testResult = testResult;
                resultModel.associatedBugRefs = associatedBugRefs;
                resultModels.push(resultModel);
            }
            // let results = resultsForGroup.results
            //     .map(async resultIdObj =>
            //     {
            //         const resultModel = new TestResultModel();
            //         resultModel.testResult = await this.testResultsClient.getTestResultById(Number.parseInt(resultIdObj.testRun.id), resultIdObj.id);
            //         // Remove flaky tests
            //         if (TcmHelper.isTestFlaky(resultModel.testResult))
            //         {
            //             return null;
            //         }
            //         resultModel.associatedBugRefs = await this.testResultsClient.queryTestResultBugs(resultModel.testResult.automatedTestName, resultModel.testResult.id);
            //         return resultModel;
            //     });
            //Remove all null values from array
            //results = results.filter(r => r != null);
            //results.forEach(async result => resultModels.push((await result)));
            resultModels.forEach(result => bugReferencesInGroup.push(...result.associatedBugRefs));
            return resultModels;
        });
    }
    filterTestResults(resultIdsToFetch, maxItems) {
        var hasFiltered = false;
        var remainingItems = maxItems;
        for (let i = 0; i < resultIdsToFetch.resultsForGroup.length; i++) {
            const group = resultIdsToFetch.resultsForGroup[i];
            var currentItemsSize = group.results.length;
            if (currentItemsSize > remainingItems) {
                hasFiltered = true;
                const results = [];
                results.push(...group.results);
                group.results = results.splice(0, remainingItems);
                break;
            }
            remainingItems -= group.results.length;
        }
        resultIdsToFetch.resultsForGroup = resultIdsToFetch.resultsForGroup.filter(group => group.results.length > 0);
        return hasFiltered;
    }
    getIncludedOutcomes(testResultsConfiguration) {
        const includedOutcomes = [];
        if (testResultsConfiguration.$includeFailedTests) {
            includedOutcomes.push(TestInterfaces_1.TestOutcome.Failed);
        }
        if (testResultsConfiguration.$includeOtherTests) {
            includedOutcomes.push(...TcmHelper_1.TcmHelper.exceptOutcomes([TestInterfaces_1.TestOutcome.Failed, TestInterfaces_1.TestOutcome.Passed]));
        }
        if (testResultsConfiguration.$includePassedTests) {
            includedOutcomes.push(TestInterfaces_1.TestOutcome.Passed);
        }
        return includedOutcomes;
    }
}
exports.TestResultsDataProvider = TestResultsDataProvider;
//# sourceMappingURL=TestResultsDataProvider.js.map