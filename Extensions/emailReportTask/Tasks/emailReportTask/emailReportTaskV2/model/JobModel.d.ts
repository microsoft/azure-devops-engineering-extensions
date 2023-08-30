import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { TaskModel } from "./TaskModel";
import { IssueModel } from "./IssueModel";
export declare class JobModel {
    private tasks;
    private jobStatus;
    private issues;
    private jobName;
    constructor($jobName: string, $jobStatus: TaskStatus, $issues: IssueModel[], $tasks: TaskModel[]);
    /**
   * Getter $jobName
   * @return {string}
   */
    get $jobName(): string;
    /**
   * Getter $issues
   * @return {IssueModel[]}
   */
    get $issues(): IssueModel[];
    /**
     * Getter $tasks
     * @return {TaskModel[]}
     */
    get $tasks(): TaskModel[];
    /**
     * Getter $jobStatus
     * @return {TaskStatus}
     */
    get $jobStatus(): TaskStatus;
}
