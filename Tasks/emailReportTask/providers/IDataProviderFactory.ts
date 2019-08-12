import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";

export interface IDataProviderFactory {
  getDataProviders() : IDataProvider[];
  getPostProcessors() : IPostProcessor[];  
}