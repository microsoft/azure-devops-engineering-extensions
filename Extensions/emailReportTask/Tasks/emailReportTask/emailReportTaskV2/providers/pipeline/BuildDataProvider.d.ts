import { IDataProvider } from "../IDataProvider";
import { Report } from "../../model/Report";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { IPipelineRestClient } from "../restclients/IPipelineRestClient";
export declare class BuildDataProvider implements IDataProvider {
    private pipelineRestClient;
    constructor(pipelineRestClient: IPipelineRestClient);
    getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfiguration: ReportDataConfiguration): Promise<Report>;
    private getBuildAsync;
    private getPhases;
    private getTaskState;
    private getOrder;
}
