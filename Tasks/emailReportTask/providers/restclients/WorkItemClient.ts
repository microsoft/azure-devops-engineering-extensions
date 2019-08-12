import { AbstractClient } from "./AbstractClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { IWorkItemClient } from "./IWorkItemClient";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";

export class WorkItemClient extends AbstractClient implements IWorkItemClient {

  private workApiPromise : Promise<IWorkItemTrackingApi>;

  constructor(pipelineConfig: PipelineConfiguration) {
    super(pipelineConfig);
    this.workApiPromise = this.connection.getWorkItemTrackingApi();
  }

  public async getWorkItemsAsync(workItemIds: number[]): Promise<WorkItem[]> {

    const chunks: number[][] = [];
    var i,j,temparray,chunk = 100;
    for (i=0,j=workItemIds.length; i<j; i+=chunk) {
        temparray = workItemIds.slice(i,i+chunk);
        chunks.push(temparray);
    }

    const workApi = await this.workApiPromise;
    const chunkResults = chunks.map(chunk => workApi.getWorkItems(chunk));

    const workItems = await Promise.all(chunkResults);
    const flatItemList: WorkItem[] = [];
    workItems.forEach(wlist => flatItemList.push(...wlist));
    return flatItemList;

    // try {
    //   const flatItemList = await (await this.workApiPromise).getWorkItems(workItemIds);
    //   return flatItemList;
    // }
    // catch(err) {
    //   console.log(err);
    // }
    // return [];
  }
}
