import { Release, Change } from "azure-devops-node-api/interfaces/ReleaseInterfaces";

export interface IReleaseRestClient {
  getPipelineAsync() : Promise<Release>;
  getLastPipelineAsync(pipelineDefId: number, envDefId: number, sourceBranchFilter: string): Promise<Release>;
  getPipelineChangesAsync(prevPipelineId: number): Promise<Change[]>;
}