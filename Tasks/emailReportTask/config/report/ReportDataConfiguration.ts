import { GroupTestResultsBy } from "./GroupTestResultsBy";
import { TestResultsConfiguration } from "./TestResultsConfiguration";

export class ReportDataConfiguration
{
  // Determines which data to include in the Report
  private includeCommits: boolean;
  private includeOthersInTotal: boolean;
  private includeEnvironmentInfo: boolean;
  
  // Report Summary Pane Grouping 
  private groupTestSummaryBy: GroupTestResultsBy[];

  // Determines how to show Test Results in the Report
  private testResultsConfig: TestResultsConfiguration;

	constructor($includeCommits: boolean, $includeOthersInTotal: boolean, $includeEnvironmentInfo: boolean, $groupTestSummaryBy: GroupTestResultsBy[], $testResultsConfig: TestResultsConfiguration) {
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
	public get $includeCommits(): boolean {
		return this.includeCommits;
	}

    /**
     * Getter $includeOthersInTotal
     * @return {boolean}
     */
	public get $includeOthersInTotal(): boolean {
		return this.includeOthersInTotal;
	}

    /**
     * Getter $includeEnvironmentInfo
     * @return {boolean}
     */
	public get $includeEnvironmentInfo(): boolean {
		return this.includeEnvironmentInfo;
	}

    /**
     * Getter $groupTestSummaryBy
     * @return {GroupTestResultsBy[]}
     */
	public get $groupTestSummaryBy(): GroupTestResultsBy[] {
		return this.groupTestSummaryBy;
	}

    /**
     * Getter $testResultsConfig
     * @return {TestResultsConfiguration}
     */
	public get $testResultsConfig(): TestResultsConfiguration {
		return this.testResultsConfig;
	}
}