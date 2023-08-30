import { AbstractClient } from "./AbstractClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { IWorkItemClient } from "./IWorkItemClient";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
export declare class WorkItemClient extends AbstractClient implements IWorkItemClient {
    private workApiPromise;
    constructor(pipelineConfig: PipelineConfiguration);
    getWorkItemsAsync(workItemIds: number[]): Promise<WorkItem[]>;
}
