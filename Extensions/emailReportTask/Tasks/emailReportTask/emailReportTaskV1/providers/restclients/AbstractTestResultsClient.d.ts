import { AbstractClient } from "./AbstractClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ITestApi } from "azure-devops-node-api/TestApi";
import { TestResultsDetails, TestResultSummary, TestOutcome, TestResultsQuery, TestCaseResult, ResultsFilter, WorkItemReference } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ITestResultsClient } from "./ITestResultsClient";
import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
export declare abstract class AbstractTestResultsClient extends AbstractClient implements ITestResultsClient {
    private readonly MaxItemsSupported;
    protected testApiPromise: Promise<ITestApi>;
    constructor(pipelineConfig: PipelineConfiguration);
    queryTestResultBugs(automatedTestName: string, resultId: number): Promise<WorkItemReference[]>;
    getTestResultById(testRunId: number, resultId: number): Promise<TestCaseResult>;
    queryTestResultsReportAsync(parameterConfig?: PipelineConfiguration): Promise<TestResultSummary>;
    getTestResultOwnersAsync(resultsToFetch: TestCaseResult[]): Promise<IdentityRef[]>;
    getTestResultsDetailsAsync(groupBy: string, outcomeFilters?: TestOutcome[], parameterConfig?: PipelineConfiguration): Promise<TestResultsDetails>;
    getTestResultSummaryAsync(includeFailures: boolean, parameterConfig?: PipelineConfiguration): Promise<TestResultSummary>;
    getTestResultsByQueryAsync(query: TestResultsQuery): Promise<TestResultsQuery>;
    protected abstract getTestResultsDetailsForPipelineAsync(config: PipelineConfiguration, groupBy?: string, filter?: string): Promise<TestResultsDetails>;
    protected abstract queryTestResultsReportForPipelineAsync(config: PipelineConfiguration, includeFailures?: boolean): Promise<TestResultSummary>;
    protected getOutcomeFilter(outcomes: TestOutcome[]): string;
    private getUniqueName;
    private isValid;
}
export declare class TestResultsQueryImpl implements TestResultsQuery {
    fields: string[];
    results: TestCaseResult[];
    resultsFilter: ResultsFilter;
}
