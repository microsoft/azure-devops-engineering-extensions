import { TaskIssueViewModel, TaskIssueViewModelWrapper } from "./TaskIssueViewModel";
import { TaskModel } from "../TaskModel";
export declare class TaskIssueSummaryViewModel {
    Issues: TaskIssueViewModelWrapper;
    ErrorMessage: string;
    ErrorCount: number;
    WarningCount: number;
    constructor(tasks: TaskModel[]);
    TruncateIssues(issues: TaskIssueViewModel[], characterLimit?: number): TaskIssueViewModel[];
}
export declare class IssueTypeConstants {
    static readonly Error = "error";
    static readonly Warning = "warning";
}
