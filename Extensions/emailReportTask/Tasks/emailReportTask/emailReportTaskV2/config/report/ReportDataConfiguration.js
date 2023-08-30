"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportDataConfiguration = void 0;
class ReportDataConfiguration {
    constructor($includeCommits, $includeOthersInTotal, $includeEnvironmentInfo, $groupTestSummaryBy, $testResultsConfig) {
        this.includeCommits = $includeCommits;
        this.includeOthersInTotal = $includeOthersInTotal;
        this.includeEnvironmentInfo = $includeEnvironmentInfo;
        this.groupTestSummaryBy = $groupTestSummaryBy;
        this.testResultsConfig = $testResultsConfig;
    }
    /**
     * Getter $includeCommits
     * @return {boolean}
     */
    get $includeCommits() {
        return this.includeCommits;
    }
    /**
     * Getter $includeOthersInTotal
     * @return {boolean}
     */
    get $includeOthersInTotal() {
        return this.includeOthersInTotal;
    }
    /**
     * Getter $includeEnvironmentInfo
     * @return {boolean}
     */
    get $includeEnvironmentInfo() {
        return this.includeEnvironmentInfo;
    }
    /**
     * Getter $groupTestSummaryBy
     * @return {GroupTestResultsBy[]}
     */
    get $groupTestSummaryBy() {
        return this.groupTestSummaryBy;
    }
    /**
     * Getter $testResultsConfig
     * @return {TestResultsConfiguration}
     */
    get $testResultsConfig() {
        return this.testResultsConfig;
    }
}
exports.ReportDataConfiguration = ReportDataConfiguration;
//# sourceMappingURL=ReportDataConfiguration.js.map