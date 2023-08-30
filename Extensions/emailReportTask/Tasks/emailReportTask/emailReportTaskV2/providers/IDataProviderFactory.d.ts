import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
export interface IDataProviderFactory {
    getDataProviders(): IDataProvider[];
    getPostProcessors(): IPostProcessor[];
}
