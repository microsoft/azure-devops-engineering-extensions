import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
export declare class WorkItemViewModelWrapper {
    WorkItemViewModel: WorkItemViewModel[];
}
export declare class WorkItemViewModel {
    AssignedTo: string;
    ChangedDate: string;
    Id: number;
    State: string;
    Title: string;
    Url: string;
    constructor(config: PipelineConfiguration, workItem: WorkItem);
}
