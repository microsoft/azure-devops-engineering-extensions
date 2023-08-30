import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestResultsDetails, TestResultSummary } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ITestResultsClient } from "./ITestResultsClient";
import { AbstractTestResultsClient } from "./AbstractTestResultsClient";
export declare class BuildTestResultsClient extends AbstractTestResultsClient implements ITestResultsClient {
    constructor(pipelineConfig: PipelineConfiguration);
    queryTestResultsReportForPipelineAsync(config: PipelineConfiguration, includeFailures?: boolean): Promise<TestResultSummary>;
    getTestResultsDetailsForPipelineAsync(config: PipelineConfiguration, groupBy?: string, filter?: string): Promise<TestResultsDetails>;
}
