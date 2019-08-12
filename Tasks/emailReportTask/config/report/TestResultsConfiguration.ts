import { GroupTestResultsBy } from "./GroupTestResultsBy";

export class TestResultsConfiguration {  

  private includeFailedTests : boolean;
  private includePassedTests : boolean;
  private includeInconclusiveTests : boolean;
  private includeNotExecutedTests : boolean;
  private includeOtherTests : boolean;
  private groupTestResultsBy : GroupTestResultsBy;
  private maxItemsToShow: number;

	constructor($includeFailedTests: boolean, $includePassedTests: boolean, $includeInconclusiveTests: boolean, $includeNotExecutedTests: boolean, $includeOtherTests: boolean, $groupTestResultsBy: GroupTestResultsBy, $maxItemsToShow: number) {
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
	public get $includeFailedTests(): boolean {
		return this.includeFailedTests;
	}

    /**
     * Getter $includePassedTests
     * @return {boolean}
     */
	public get $includePassedTests(): boolean {
		return this.includePassedTests;
	}

    /**
     * Getter $includeInconclusiveTests
     * @return {boolean}
     */
	public get $includeInconclusiveTests(): boolean {
		return this.includeInconclusiveTests;
	}

    /**
     * Getter $includeNotExecutedTests
     * @return {boolean}
     */
	public get $includeNotExecutedTests(): boolean {
		return this.includeNotExecutedTests;
	}

    /**
     * Getter $includeOtherTests
     * @return {boolean}
     */
	public get $includeOtherTests(): boolean {
		return this.includeOtherTests;
	}

    /**
     * Getter $groupTestResultsBy
     * @return {GroupTestResultsBy}
     */
	public get $groupTestResultsBy(): GroupTestResultsBy {
		return this.groupTestResultsBy;
	}

    /**
     * Getter $maxItemsToShow
     * @return {number}
     */
	public get $maxItemsToShow(): number {
		return this.maxItemsToShow;
	}
}