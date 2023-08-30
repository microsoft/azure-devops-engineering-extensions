import { IDataProvider } from "../IDataProvider";
import { Report } from "../../model/Report";
import { IPipelineRestClient } from "../restclients/IPipelineRestClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
export declare class ReleaseDataProvider implements IDataProvider {
    private pipelineRestClient;
    constructor(pipelineRestClient: IPipelineRestClient);
    getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report>;
    private getReleaseAsync;
    private getEnvironment;
    private getPhases;
    private getJobModelsFromPhase;
    private getReleaseByLastCompletedEnvironmentAsync;
}
