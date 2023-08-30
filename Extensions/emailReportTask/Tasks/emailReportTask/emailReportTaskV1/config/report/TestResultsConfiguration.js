"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultsConfiguration = void 0;
class TestResultsConfiguration {
    constructor($includeFailedTests, $includePassedTests, $includeInconclusiveTests, $includeNotExecutedTests, $includeOtherTests, $groupTestResultsBy, $maxItemsToShow) {
        this.includeFailedTests = $includeFailedTests;
        this.includePassedTests = $includePassedTests;
        this.includeInconclusiveTests = $includeInconclusiveTests;
        this.includeNotExecutedTests = $includeNotExecutedTests;
        this.includeOtherTests = $includeOtherTests;
        this.groupTestResultsBy = $groupTestResultsBy;
        this.maxItemsToShow = $maxItemsToShow;
    }
    /**
     * Getter $includeFailedTests
     * @return {boolean}
     */
    get $includeFailedTests() {
        return this.includeFailedTests;
    }
    /**
     * Getter $includePassedTests
     * @return {boolean}
     */
    get $includePassedTests() {
        return this.includePassedTests;
    }
    /**
     * Getter $includeInconclusiveTests
     * @return {boolean}
     */
    get $includeInconclusiveTests() {
        return this.includeInconclusiveTests;
    }
    /**
     * Getter $includeNotExecutedTests
     * @return {boolean}
     */
    get $includeNotExecutedTests() {
        return this.includeNotExecutedTests;
    }
    /**
     * Getter $includeOtherTests
     * @return {boolean}
     */
    get $includeOtherTests() {
        return this.includeOtherTests;
    }
    /**
     * Getter $groupTestResultsBy
     * @return {GroupTestResultsBy}
     */
    get $groupTestResultsBy() {
        return this.groupTestResultsBy;
    }
    /**
     * Getter $maxItemsToShow
     * @return {number}
     */
    get $maxItemsToShow() {
        return this.maxItemsToShow;
    }
}
exports.TestResultsConfiguration = TestResultsConfiguration;
//# sourceMappingURL=TestResultsConfiguration.js.map