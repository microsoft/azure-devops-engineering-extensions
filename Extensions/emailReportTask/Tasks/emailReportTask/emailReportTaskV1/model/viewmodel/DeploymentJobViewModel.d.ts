import { JobModel } from "../JobModel";
import { TaskResultViewModelWrapper } from "./TaskResultViewModel";
export declare class DeploymentJobViewModel {
    Tasks: TaskResultViewModelWrapper;
    MinTaskStartTime: Date;
    MaxTaskFinishTime: Date;
    constructor(jobs: JobModel[]);
    private getMinTime;
    private getMaxTime;
}
