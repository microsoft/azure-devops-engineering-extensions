import { IDataProviderFactory } from "./IDataProviderFactory";
import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { PipelineType } from "../config/pipeline/PipelineType";
import { ReleaseDataProvider } from "./pipeline/ReleaseDataProvider";
import { ReleaseRestClient } from "./restclients/ReleaseClient";
import { TestOwnersDataProvider } from "./tcmproviders/TestOwnersDataProvider";
import { TestSummaryDataProvider } from "./tcmproviders/TestSummaryDataProvider";
import { TestResultsDataProvider } from "./tcmproviders/TestResultsDataProvider";
import { WorkItemClient } from "./restclients/WorkItemClient";
import { SendMailConditionProcessor } from "./SendMailConditionProcessor";
import { BuildRestClient } from "./restclients/BuildClient";
import { BuildDataProvider } from "./pipeline/BuildDataProvider";
import { ITestResultsClient } from "./restclients/ITestResultsClient";
import { BuildTestResultsClient } from "./restclients/BuildTestResultsClient";
import { ReleaseTestResultsClient } from "./restclients/ReleaseTestResultsClient";

export class DataProviderFactory implements IDataProviderFactory {

  private pipelineConfig: PipelineConfiguration;
  private dataProviders: IDataProvider[] = [];
  private postProcessors: IPostProcessor[] = [];

  private testResultsClient: ITestResultsClient;

  constructor($pipelineConfig: PipelineConfiguration) {
    this.pipelineConfig = $pipelineConfig;
  }

  public getDataProviders(): IDataProvider[] {
    if (this.dataProviders.length < 1) {
      if (this.pipelineConfig.$pipelineType == PipelineType.Release) {
        const pipelineRestClient = new ReleaseRestClient(this.pipelineConfig);
        this.dataProviders.push(new ReleaseDataProvider(pipelineRestClient));
      } else {
        const pipelineRestClient = new BuildRestClient(this.pipelineConfig);
        this.dataProviders.push(new BuildDataProvider(pipelineRestClient));
      }
      const testResultsClient = this.getTestResultsClient();
      const workItemClient = new WorkItemClient(this.pipelineConfig);

      this.dataProviders.push(new TestOwnersDataProvider(testResultsClient));
      this.dataProviders.push(new TestSummaryDataProvider(testResultsClient));
      this.dataProviders.push(new TestResultsDataProvider(testResultsClient, workItemClient));
    }

    return this.dataProviders;
  }

  public getPostProcessors(): IPostProcessor[] {
    if (this.postProcessors.length < 1) {
      this.postProcessors.push(new SendMailConditionProcessor(this.getTestResultsClient()));
    }

    return this.postProcessors;
  }

  private getTestResultsClient(): ITestResultsClient {
    if(this.testResultsClient == null) {
      this.testResultsClient = this.pipelineConfig.$pipelineType == PipelineType.Build ?
        new BuildTestResultsClient(this.pipelineConfig) :
        new ReleaseTestResultsClient(this.pipelineConfig);
    }
    return this.testResultsClient;
  }
}