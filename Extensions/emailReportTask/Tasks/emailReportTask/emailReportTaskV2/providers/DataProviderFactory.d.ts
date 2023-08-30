import { IDataProviderFactory } from "./IDataProviderFactory";
import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
export declare class DataProviderFactory implements IDataProviderFactory {
    private pipelineConfig;
    private dataProviders;
    private postProcessors;
    private testResultsClient;
    constructor($pipelineConfig: PipelineConfiguration);
    getDataProviders(): IDataProvider[];
    getPostProcessors(): IPostProcessor[];
    private getTestResultsClient;
}
