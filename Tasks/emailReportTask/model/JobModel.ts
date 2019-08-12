import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { TaskModel } from "./TaskModel";
import { IssueModel } from "./IssueModel";

export class JobModel {

  private tasks: TaskModel[];
  private jobStatus: TaskStatus;
  private issues: IssueModel[];
  private jobName: string;

	constructor( $jobName: string, $jobStatus: TaskStatus, $issues: IssueModel[], $tasks: TaskModel[]) {
		this.tasks = $tasks;
		this.jobStatus = $jobStatus;
		this.issues = $issues;
		this.jobName = $jobName;
  }

      /**
     * Getter $jobName
     * @return {string}
     */
	public get $jobName(): string {
		return this.jobName;
  }
  
      /**
     * Getter $issues
     * @return {IssueModel[]}
     */
	public get $issues(): IssueModel[] {
		return this.issues;
	}

    /**
     * Getter $tasks
     * @return {TaskModel[]}
     */
	public get $tasks(): TaskModel[] {
		return this.tasks;
	}

    /**
     * Getter $jobStatus
     * @return {TaskStatus}
     */
	public get $jobStatus(): TaskStatus {
		return this.jobStatus;
	}
}