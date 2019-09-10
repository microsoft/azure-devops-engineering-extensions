import { Release } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { Build, Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ChangeModel } from "../../model/ChangeModel";

export interface IPipelineRestClient {
  getPipelineAsync(): Promise<Release> | Promise<Build>;
  getLastPipelineAsync(pipelineDefId: number, envDefId: number, sourceBranchFilter: string, maxCreatedDate?: Date): Promise<Release> | Promise<Build>;
  getPipelineChangesAsync(prevPipelineId: number): Promise<ChangeModel[]>;
  getPipelineTimelineAsync(pipelineId: number): Promise<Timeline>;
}