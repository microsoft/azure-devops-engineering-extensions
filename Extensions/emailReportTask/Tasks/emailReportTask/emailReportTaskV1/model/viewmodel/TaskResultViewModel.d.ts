import { TaskIssueSummaryViewModel } from "./TaskIssueSummaryViewModel";
import { TaskModel } from "../TaskModel";
export declare class TaskResultViewModelWrapper {
    TaskResultViewModel: TaskResultViewModel[];
}
export declare class TaskResultViewModel {
    Duration: string;
    HasFailed: boolean;
    HasSkipped: boolean;
    NotYetRun: boolean;
    HasPartiallySucceeded: boolean;
    HasNotRunOnSomeAgents: boolean;
    GotCancelled: boolean;
    NotRunMessage: string;
    IssuesSummary: TaskIssueSummaryViewModel;
    Name: string;
    StartTime: string;
    Status: string;
    constructor(tasks: TaskModel[]);
    private InitializeDuration;
    private getMinTime;
    private getMaxTime;
    private getTimeDiff;
}
