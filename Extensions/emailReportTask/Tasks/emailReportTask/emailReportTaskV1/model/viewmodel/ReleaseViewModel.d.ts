import { ReleaseEnvironment } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ReleaseEnvironmentViewModel } from "./ReleaseEnvironmentViewModel";
export declare class ReleaseViewModel {
    CurrentEnvironment: ReleaseEnvironmentViewModel;
    ReleaseDefinitionName: string;
    ReleaseDefinitionUrl: string;
    ReleaseId: number;
    ReleaseName: string;
    ReleaseSummaryUrl: string;
    ReleaseLogsLink: string;
    constructor(currentEnvironment: ReleaseEnvironment, releaseConfig: PipelineConfiguration);
}
