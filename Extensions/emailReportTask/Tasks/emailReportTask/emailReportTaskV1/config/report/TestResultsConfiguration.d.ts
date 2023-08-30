import { GroupTestResultsBy } from "./GroupTestResultsBy";
export declare class TestResultsConfiguration {
    private includeFailedTests;
    private includePassedTests;
    private includeInconclusiveTests;
    private includeNotExecutedTests;
    private includeOtherTests;
    private groupTestResultsBy;
    private maxItemsToShow;
    constructor($includeFailedTests: boolean, $includePassedTests: boolean, $includeInconclusiveTests: boolean, $includeNotExecutedTests: boolean, $includeOtherTests: boolean, $groupTestResultsBy: GroupTestResultsBy, $maxItemsToShow: number);
    /**
     * Getter $includeFailedTests
     * @return {boolean}
     */
    get $includeFailedTests(): boolean;
    /**
     * Getter $includePassedTests
     * @return {boolean}
     */
    get $includePassedTests(): boolean;
    /**
     * Getter $includeInconclusiveTests
     * @return {boolean}
     */
    get $includeInconclusiveTests(): boolean;
    /**
     * Getter $includeNotExecutedTests
     * @return {boolean}
     */
    get $includeNotExecutedTests(): boolean;
    /**
     * Getter $includeOtherTests
     * @return {boolean}
     */
    get $includeOtherTests(): boolean;
    /**
     * Getter $groupTestResultsBy
     * @return {GroupTestResultsBy}
     */
    get $groupTestResultsBy(): GroupTestResultsBy;
    /**
     * Getter $maxItemsToShow
     * @return {number}
     */
    get $maxItemsToShow(): number;
}
