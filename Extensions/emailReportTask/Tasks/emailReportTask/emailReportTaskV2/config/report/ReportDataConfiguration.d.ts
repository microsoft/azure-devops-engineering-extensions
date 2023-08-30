import { GroupTestResultsBy } from "./GroupTestResultsBy";
import { TestResultsConfiguration } from "./TestResultsConfiguration";
export declare class ReportDataConfiguration {
    private includeCommits;
    private includeOthersInTotal;
    private includeEnvironmentInfo;
    private groupTestSummaryBy;
    private testResultsConfig;
    constructor($includeCommits: boolean, $includeOthersInTotal: boolean, $includeEnvironmentInfo: boolean, $groupTestSummaryBy: GroupTestResultsBy[], $testResultsConfig: TestResultsConfiguration);
    /**
     * Getter $includeCommits
     * @return {boolean}
     */
    get $includeCommits(): boolean;
    /**
     * Getter $includeOthersInTotal
     * @return {boolean}
     */
    get $includeOthersInTotal(): boolean;
    /**
     * Getter $includeEnvironmentInfo
     * @return {boolean}
     */
    get $includeEnvironmentInfo(): boolean;
    /**
     * Getter $groupTestSummaryBy
     * @return {GroupTestResultsBy[]}
     */
    get $groupTestSummaryBy(): GroupTestResultsBy[];
    /**
     * Getter $testResultsConfig
     * @return {TestResultsConfiguration}
     */
    get $testResultsConfig(): TestResultsConfiguration;
}
