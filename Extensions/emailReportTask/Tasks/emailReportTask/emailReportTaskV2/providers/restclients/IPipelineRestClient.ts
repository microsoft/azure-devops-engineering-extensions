import { Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ChangeModel } from "../../model/ChangeModel";

export interface IPipelineRestClient {
  getPipelineAsync(): Promise<any>;
  getLastPipelineAsync(pipelineDefId: number, envDefId: number, sourceBranchFilter: string, maxCreatedDate?: Date): Promise<any>;
  getPipelineChangesAsync(prevPipelineId: number): Promise<ChangeModel[]>;
  getPipelineTimelineAsync(pipelineId: number): Promise<Timeline>;
}