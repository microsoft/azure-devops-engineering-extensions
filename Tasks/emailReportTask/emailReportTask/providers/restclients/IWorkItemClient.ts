import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";

export interface IWorkItemClient {
  getWorkItemsAsync(workItemIds: number[]): Promise<WorkItem[]>;
}