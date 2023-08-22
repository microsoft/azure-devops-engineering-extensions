import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { IssueModel } from "./IssueModel";

export class TaskModel {

  private name: string;
  private status: TaskStatus;
  private issues: IssueModel[];
  private agentName: string;
  private finishTime: Date;
  private startTime: Date;

  constructor($name: string, $status: TaskStatus, $issues: IssueModel[], $agentName: string, $finishTime: Date, $startTime: Date) {
    this.name = $name;
    this.status = $status;
    this.issues = $issues;
    this.agentName = $agentName;
    this.finishTime = $finishTime;
    this.startTime = $startTime;
  }

  /**
   * Getter $name
   * @return {string}
   */
  public get $name(): string {
    return this.name;
  }

  /**
   * Getter $status
   * @return {TaskStatus}
   */
  public get $status(): TaskStatus {
    return this.status;
  }

  /**
   * Getter $issues
   * @return {IssueModel[]}
   */
  public get $issues(): IssueModel[] {
    return this.issues;
  }

  /**
   * Getter $agentName
   * @return {string}
   */
  public get $agentName(): string {
    return this.agentName;
  }

  /**
   * Getter $finishTime
   * @return {Date}
   */
  public get $finishTime(): Date {
    return this.finishTime;
  }

  /**
   * Getter $startTime
   * @return {Date}
   */
  public get $startTime(): Date {
    return this.startTime;
  }
}