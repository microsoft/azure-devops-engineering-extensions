import { TestResultsDetails, TestResultSummary, TestOutcome, TestCaseResult, WorkItemReference } from "azure-devops-node-api/interfaces/TestInterfaces";
import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

export interface ITestResultsClient {
  queryTestResultBugs(automatedTestName: string, resultId: number): Promise<WorkItemReference[]>;
  getTestResultById(testRunId: number, resultId: number): Promise<TestCaseResult>;
  queryTestResultsReportAsync(): Promise<void>;
  getTestResultOwnersAsync(resultsToFetch: TestCaseResult[]): Promise<IdentityRef[]>;
  getTestResultsDetailsAsync(groupBy: string, outcomeFilters?: TestOutcome[]): Promise<TestResultsDetails>;
  getTestResultSummaryAsync(includeFailures: boolean): Promise<TestResultSummary>;
}