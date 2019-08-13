import { IDataProviderFactory } from "./IDataProviderFactory";
import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { PipelineType } from "../config/pipeline/PipelineType";
import { ReleaseDataProvider } from "./pipeline/ReleaseDataProvider";
import { ReleaseRestClient } from "./restclients/ReleaseClient";
import { TestOwnersDataProvider } from "./tcmproviders/TestOwnersDataProvider";
import { TestResultsClient } from "./restclients/TestResultsClient";
import { TestSummaryDataProvider } from "./tcmproviders/TestSummaryDataProvider";
import { TestResultsDataProvider } from "./tcmproviders/TestResultsDataProvider";
import { WorkItemClient } from "./restclients/WorkItemClient";
import { SendMailConditionProcessor } from "./SendMailConditionProcessor";
import { BuildRestClient } from "./restclients/BuildClient";
import { BuildDataProvider } from "./pipeline/BuildDataProvider";

export class DataProviderFactory implements IDataProviderFactory {

  private pipelineConfig: PipelineConfiguration;
  private dataProviders: IDataProvider[] = [];
  private postProcessors: IPostProcessor[] = [];

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
      const testResultsClient = new TestResultsClient(this.pipelineConfig);
      const workItemClient = new WorkItemClient(this.pipelineConfig);

      this.dataProviders.push(new TestOwnersDataProvider(testResultsClient));
      this.dataProviders.push(new TestSummaryDataProvider(testResultsClient));
      this.dataProviders.push(new TestResultsDataProvider(testResultsClient, workItemClient));
    }

    return this.dataProviders;
  }

  public getPostProcessors(): IPostProcessor[] {
    if (this.postProcessors.length < 1) {
      this.postProcessors.push(new SendMailConditionProcessor());
    }

    return this.postProcessors;
  }
}