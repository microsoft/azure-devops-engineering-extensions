import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestResultsDetails, TestResultSummary } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ITestResultsClient } from "./ITestResultsClient";
import { AbstractTestResultsClient } from "./AbstractTestResultsClient";

export class BuildTestResultsClient extends AbstractTestResultsClient implements ITestResultsClient {

  constructor(pipelineConfig: PipelineConfiguration) {
    super(pipelineConfig);
  }

  public async queryTestResultsReportForPipelineAsync(config: PipelineConfiguration, includeFailures?: boolean): Promise<TestResultSummary> {
    return await (await this.testApiPromise).queryTestResultsReportForBuild(
      config.$projectName,
      config.$pipelineId,
      null,
      includeFailures);
  }

  public async getTestResultsDetailsForPipelineAsync(config: PipelineConfiguration, groupBy?: string, filter?: string): Promise<TestResultsDetails> {
    return await (await this.testApiPromise).getTestResultDetailsForBuild(
      config.$projectName,
      config.$pipelineId,
      null,
      groupBy,
      filter);
  }
}