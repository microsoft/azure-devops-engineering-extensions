import { IPipelineRestClient } from "./IPipelineRestClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Build, Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ChangeModel } from "../../model/ChangeModel";
import { AbstractClient } from "./AbstractClient";
export declare class BuildRestClient extends AbstractClient implements IPipelineRestClient {
    private buildApi;
    constructor(pipelineConfig: PipelineConfiguration);
    getPipelineAsync(): Promise<Build>;
    getLastPipelineAsync(pipelineDefId: number, envDefId: number, sourceBranchFilter: string, maxCreatedDate?: Date): Promise<Build>;
    getPipelineChangesAsync(prevPipelineId: number): Promise<ChangeModel[]>;
    getPipelineTimelineAsync(pipelineId: number): Promise<Timeline>;
}
