"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const util_1 = require("util");
class Report {
    constructor() {
        this.dataMissing = false;
        this.sendMailConditionSatisfied = false;
        this.associatedChanges = [];
        this.phases = [];
        this.failedTestOwners = [];
        this.filteredResults = [];
        this.hasFilteredTests = false;
        this.testSummaryGroups = [];
    }
    /**
     * Getter $dataMissing
     * @return {boolean}
     */
    get $dataMissing() {
        return this.dataMissing;
    }
    /**
   * Getter $associatedChanges
   * @return {ChangeModel[]}
   */
    get $associatedChanges() {
        return this.associatedChanges;
    }
    /**
  * Getter $associatedChanges
  * @return {ChangeModel[]}
  */
    get $phases() {
        return this.phases;
    }
    /**
     * Getter $sendMailConditionSatisfied
     * @return {boolean}
     */
    get $sendMailConditionSatisfied() {
        return this.sendMailConditionSatisfied;
    }
    /**
     * Setter $dataMissing
     * @param {boolean} value
     */
    set $dataMissing(value) {
        this.dataMissing = value;
    }
    /**
     * Setter $sendMailConditionSatisfied
     * @param {boolean} value
     */
    set $sendMailConditionSatisfied(value) {
        this.sendMailConditionSatisfied = value;
    }
    /**
     * Getter $testSummaryGroups
     * @return {TestSummaryGroupModel[]}
     */
    get $testSummaryGroups() {
        return this.testSummaryGroups;
    }
    /**
     * Getter $failedTestOwners
     * @return {IdentityRef[] }
     */
    get $failedTestOwners() {
        return this.failedTestOwners;
    }
    hasFailedTests(includeOthersInTotal) {
        if (util_1.isNullOrUndefined(this.testResultSummary)) {
            return false;
        }
        if (!includeOthersInTotal) {
            return this.getTestCountForOutcome(TestInterfaces_1.TestOutcome.Failed) > 0;
        }
        // Others need to be included - Calculate failed as (total - passed)
        const passedCount = this.getTestCountForOutcome(TestInterfaces_1.TestOutcome.Passed);
        if (passedCount > 0) {
            return (this.testResultSummary.aggregatedResultsAnalysis.totalTests - passedCount) > 0;
        }
        // If no passed tests, then anything ran should be considered as failed since "other" outcomes need to be considered as failures
        // if no tests ran, then we don't have failed tests 
        return this.testResultSummary.aggregatedResultsAnalysis.totalTests > 0;
    }
    getTestCountForOutcome(outcome) {
        const resultsByOutcome = this.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome;
        let testsForOutcome = 0;
        if (!util_1.isNullOrUndefined(resultsByOutcome) && !util_1.isNullOrUndefined(resultsByOutcome[outcome])) {
            testsForOutcome += resultsByOutcome[outcome].count;
        }
        return testsForOutcome;
    }
}
exports.Report = Report;
//# sourceMappingURL=Report.js.map