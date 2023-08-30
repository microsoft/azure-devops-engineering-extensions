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
exports.SendMailConditionProcessor = void 0;
const SendMailCondition_1 = require("../config/report/SendMailCondition");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const util_1 = require("util");
const TcmHelper_1 = require("./tcmproviders/TcmHelper");
const AbstractTestResultsClient_1 = require("./restclients/AbstractTestResultsClient");
const EnumUtils_1 = require("../utils/EnumUtils");
class SendMailConditionProcessor {
    constructor(testResultsClient) {
        this.TestResultFieldsToQuery = ["TestCaseReferenceId", "OutcomeConfidence"];
        this.testResultsClient = testResultsClient;
    }
    processReportAsync(reportConfig, report) {
        return __awaiter(this, void 0, void 0, function* () {
            var shouldSendMail = false;
            if (!report.$dataMissing) {
                const sendMailCondition = reportConfig.$sendMailCondition;
                shouldSendMail = sendMailCondition == SendMailCondition_1.SendMailCondition.Always;
                if (!shouldSendMail) {
                    var hasTestFailures = report.hasFailedTests(reportConfig.$reportDataConfiguration.$includeOthersInTotal);
                    var hasFailedTasks = report.hasFailedTasks();
                    var hasCanceledPhases = report.hasCanceledPhases();
                    var hasFailure = hasTestFailures || hasFailedTasks || hasCanceledPhases;
                    if ((sendMailCondition == SendMailCondition_1.SendMailCondition.OnFailure && hasFailure)
                        || (sendMailCondition == SendMailCondition_1.SendMailCondition.OnSuccess && !hasFailure)) {
                        shouldSendMail = true;
                    }
                    else if (sendMailCondition == SendMailCondition_1.SendMailCondition.OnNewFailuresOnly && hasFailure) {
                        // Always treat phase cancellation issues as new failure as we cannot distinguish/compare phase level issues
                        // Still compare failed tests and failed tasks where possible to reduce noise
                        if (hasCanceledPhases && !hasTestFailures && !hasFailedTasks) {
                            shouldSendMail = true;
                            console.log(`Has Phase cancellation(s) issues. Treating as new failure.`);
                        }
                        else {
                            console.log(`Looking for new failures, as the user send mail condition is '${EnumUtils_1.EnumUtils.GetMailConditionString(sendMailCondition)}'.`);
                            shouldSendMail = !(yield this.hasPreviousReleaseGotSameFailuresAsync(report, reportConfig.$pipelineConfiguration, hasTestFailures, hasFailedTasks));
                        }
                    }
                }
            }
            report.$sendMailConditionSatisfied = shouldSendMail;
            return shouldSendMail;
        });
    }
    hasPreviousReleaseGotSameFailuresAsync(report, config, hasTestFailures, hasFailedTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            var hasPrevGotSameFailures = report.hasPrevGotSameFailures();
            if (!util_1.isNullOrUndefined(hasPrevGotSameFailures) && hasPrevGotSameFailures) {
                return hasPrevGotSameFailures;
            }
            const hasPrevFailedTasks = report.hasPrevFailedTasks();
            if (report.testResultSummary == null) {
                return false;
            }
            if (hasTestFailures) {
                var prevConfig = report.getPrevConfig(config);
                if (util_1.isNullOrUndefined(prevConfig)) {
                    // we don't know anything about prev pipeline failures if we have no info - assume they are not same
                    return false;
                }
                var lastCompletedTestResultSummary = yield this.testResultsClient.queryTestResultsReportAsync(prevConfig);
                var failedInCurrent = this.getFailureCountFromSummary(report.testResultSummary);
                var failedinPrev = this.getFailureCountFromSummary(lastCompletedTestResultSummary);
                // Threshold is 10 to decide whether they are same failures
                console.log(`Current Failures Found: '${failedInCurrent}'.`);
                console.log(`Previous Failures Found: '${failedinPrev}'.`);
                var hasSameFailures = failedInCurrent == failedinPrev;
                // No point in moving ahead if number of failures is different
                if (hasSameFailures) {
                    var currFailedTestCaseRefIds = yield this.fetchFailedTestCaseIdsAsync(config);
                    var prevFailedTestCaseRefIds = yield this.fetchFailedTestCaseIdsAsync(prevConfig);
                    const leftJoin = currFailedTestCaseRefIds.filter(c => !prevFailedTestCaseRefIds.includes(c));
                    if (leftJoin.length > 0) {
                        console.log(`Difference in Failed Test Reference Ids found between current and prev pipeline.`);
                        hasSameFailures = false;
                    }
                    else {
                        const rightJoin = prevFailedTestCaseRefIds.filter(p => !currFailedTestCaseRefIds.includes(p));
                        if (rightJoin.length > 0) {
                            console.log(`Difference in Failed Test Reference Ids found between current and prev pipeline.`);
                            hasSameFailures = false;
                        }
                        else {
                            console.log(`Failed Test Reference Ids match. No new failures found.`);
                            hasSameFailures = true;
                        }
                    }
                }
                return hasSameFailures;
            }
            else if (hasFailedTasks && hasPrevFailedTasks) {
                return report.arePrevFailedTasksSame();
            }
            return false;
        });
    }
    getFailureCountFromSummary(testResultSummary) {
        const failedOutcome = testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[TestInterfaces_1.TestOutcome.Failed];
        return !util_1.isNullOrUndefined(failedOutcome) ? failedOutcome.count : 0;
    }
    fetchFailedTestCaseIdsAsync(pipelineConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            var testSummary = yield this.testResultsClient.getTestResultsDetailsAsync(null, [TestInterfaces_1.TestOutcome.Failed], pipelineConfig);
            var resultsToQuery = [];
            testSummary.resultsForGroup.forEach(r => resultsToQuery.push(...r.results));
            var testCaseIds = [];
            if (resultsToQuery.length > 0) {
                // API supports only 100 results at a time
                const tasks = [];
                for (let i = 0, j = resultsToQuery.length; i < j; i += 100) {
                    const tempArray = resultsToQuery.slice(i, i + 100);
                    let query = new AbstractTestResultsClient_1.TestResultsQueryImpl();
                    query.fields = this.TestResultFieldsToQuery;
                    query.results = tempArray;
                    tasks.push(this.testResultsClient.getTestResultsByQueryAsync(query));
                }
                const resultQueries = yield Promise.all(tasks);
                resultQueries.forEach(rq => {
                    let tempIds = rq.results.filter(r => TcmHelper_1.TcmHelper.isTestFlaky(r)).map(r1 => r1.testCaseReferenceId);
                    testCaseIds.push(...tempIds);
                });
            }
            return testCaseIds;
        });
    }
}
exports.SendMailConditionProcessor = SendMailConditionProcessor;
//# sourceMappingURL=SendMailConditionProcessor.js.map