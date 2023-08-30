import { Release } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { AbstractClient } from "./AbstractClient";
import { IPipelineRestClient } from "./IPipelineRestClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ChangeModel } from "../../model/ChangeModel";
export declare class ReleaseRestClient extends AbstractClient implements IPipelineRestClient {
    constructor(pipelineConfig: PipelineConfiguration);
    getPipelineAsync(): Promise<Release>;
    getLastPipelineAsync(pipelineDefId: number, envDefId: number, sourceBranchFilter: string, maxCreatedDate?: Date): Promise<Release>;
    getPipelineChangesAsync(prevPipelineId: number): Promise<ChangeModel[]>;
    getPipelineTimelineAsync(pipelineId: number): Promise<import("azure-devops-node-api/interfaces/BuildInterfaces").Timeline>;
}
