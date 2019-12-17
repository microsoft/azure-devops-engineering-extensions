import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestResultsDetails, TestResultSummary } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ITestResultsClient } from "./ITestResultsClient";
import { AbstractTestResultsClient } from "./AbstractTestResultsClient";

export class ReleaseTestResultsClient extends AbstractTestResultsClient implements ITestResultsClient {

  constructor(pipelineConfig: PipelineConfiguration) {
    super(pipelineConfig);
  }

  public async queryTestResultsReportForPipelineAsync(config: PipelineConfiguration, includeFailures?: boolean): Promise<TestResultSummary> {
    return await (await this.testApiPromise).queryTestResultsReportForRelease(
      config.$projectName,
      config.$pipelineId,
      config.$environmentId,
      null,
      includeFailures);
  }

  public async getTestResultsDetailsForPipelineAsync(config: PipelineConfiguration, groupBy?: string, filter?: string,): Promise<TestResultsDetails> {
    return await (await this.testApiPromise).getTestResultDetailsForRelease(
      config.$projectName,
      config.$pipelineId,
      config.$environmentId,
      null,
      groupBy,
      filter);
  }
}