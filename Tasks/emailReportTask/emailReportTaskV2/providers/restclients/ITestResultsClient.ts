import { TestResultsDetails, TestResultSummary, TestOutcome, TestCaseResult, WorkItemReference, TestResultsQuery } from "azure-devops-node-api/interfaces/TestInterfaces";
import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";

export interface ITestResultsClient {
  queryTestResultBugs(automatedTestName: string, resultId: number): Promise<WorkItemReference[]>;
  getTestResultById(testRunId: number, resultId: number): Promise<TestCaseResult>;
  queryTestResultsReportAsync(config?: PipelineConfiguration): Promise<TestResultSummary>;
  getTestResultOwnersAsync(resultsToFetch: TestCaseResult[]): Promise<IdentityRef[]>;
  getTestResultsDetailsAsync(groupBy: string, outcomeFilters?: TestOutcome[], config?: PipelineConfiguration): Promise<TestResultsDetails>;
  getTestResultSummaryAsync(includeFailures: boolean, config?: PipelineConfiguration): Promise<TestResultSummary>;
  getTestResultsByQueryAsync(query: TestResultsQuery): Promise<TestResultsQuery>;
}