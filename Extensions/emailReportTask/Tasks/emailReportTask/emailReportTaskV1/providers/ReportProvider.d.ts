import { IReportProvider } from "./IReportProvider";
import { ReportConfiguration } from "../config/ReportConfiguration";
import { Report } from "../model/Report";
import { IDataProviderFactory } from "./IDataProviderFactory";
export declare class ReportProvider implements IReportProvider {
    private dataProviders;
    private postProcessors;
    constructor(dataProviderFactory: IDataProviderFactory);
    createReportAsync(reportConfig: ReportConfiguration): Promise<Report>;
    private callDataProvider;
    private callPostProcessor;
}
