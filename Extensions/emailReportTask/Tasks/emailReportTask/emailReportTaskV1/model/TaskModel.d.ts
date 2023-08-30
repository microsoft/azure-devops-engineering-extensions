import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { IssueModel } from "./IssueModel";
export declare class TaskModel {
    private name;
    private status;
    private issues;
    private agentName;
    private finishTime;
    private startTime;
    constructor($name: string, $status: TaskStatus, $issues: IssueModel[], $agentName: string, $finishTime: Date, $startTime: Date);
    /**
     * Getter $name
     * @return {string}
     */
    get $name(): string;
    /**
     * Getter $status
     * @return {TaskStatus}
     */
    get $status(): TaskStatus;
    /**
     * Getter $issues
     * @return {IssueModel[]}
     */
    get $issues(): IssueModel[];
    /**
     * Getter $agentName
     * @return {string}
     */
    get $agentName(): string;
    /**
     * Getter $finishTime
     * @return {Date}
     */
    get $finishTime(): Date;
    /**
     * Getter $startTime
     * @return {Date}
     */
    get $startTime(): Date;
}
