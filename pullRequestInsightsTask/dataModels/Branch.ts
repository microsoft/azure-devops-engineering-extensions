import { AbstractPipeline } from "./AbstractPipeline";
import tl = require("azure-pipelines-task-lib/task");
import stats from "stats-lite";
import { PipelineTask } from "./PipelineTask";
import { BranchStatus } from "./BranchStatus";

export class Branch {
  private pipelines: AbstractPipeline[];
  private name: string;
  private static readonly NAME_SEPERATOR = "/";

  constructor(name: string, pipelines?: AbstractPipeline[]) {
    this.pipelines = [];
    if (pipelines) {
      this.setPipelines(pipelines);
    }
    this.name = name;
  }

  /**
   * Sets pipelines on this branch
   * @param pipelines Pipelines to use for this branch
   */
  public setPipelines(pipelines: AbstractPipeline[]): void {
    this.pipelines = pipelines;
    console.log(
      "Number of pipelines set on " + this.name + " = " + this.pipelines.length
    );
  }

  /**
   * Determines if this branch is healthy based on pipelines on its pipelines
   * @param numberPipelinesToConsider Number of past pipelines to use to determine health
   */
  public isHealthy(numberPipelinesToConsider: number): boolean {
    const pipelinesToConsider: AbstractPipeline[] = this.getCompletePipelines(
      numberPipelinesToConsider
    );
    for (const pipeline of pipelinesToConsider) {
      tl.debug("considering pipeline " + pipeline.getName());
      console.log(pipeline.getName() + " is a failure? " + pipeline.isFailure());
      if (pipeline.isFailure()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the status of this branch based on the failures of some number of most recent
   * complete pipelines on this branch
   * @param numberPipelinesToConsider Number of complete pipelines to consider for this branch's status
   */
  public getStatus(numberPipelinesToConsider: number): BranchStatus {
    let failureCount = 0;
    let status: BranchStatus = BranchStatus.Healthy;
    for (const pipeline of this.getCompletePipelines(
      numberPipelinesToConsider
    )) {
      if (pipeline.isFailure()) {
        failureCount++;
        status = BranchStatus.Flakey;
      }
    }
    if (
      this.getCompletePipelines(numberPipelinesToConsider).length > 0 &&
      failureCount ===
        this.getCompletePipelines(numberPipelinesToConsider).length
    ) {
      status = BranchStatus.Unhealthy;
    }
    return status;
  }

  /**
   * Gets list of pipelines on this branch that have finished running using a maximum number of pipelines to get
   * If fewer complete pipelines are present, all complete pipelines are returned
   * @param maxNumberPipelinesToReturn Maximum number of complete pipelines desired
   */
  public getCompletePipelines(
    maxNumberPipelinesToReturn: number
  ): AbstractPipeline[] {
    const realNumberPipelinesToConsider = Math.min(
      this.filterForCompletePipelines().length,
      maxNumberPipelinesToReturn
    );
    return this.filterForCompletePipelines().slice(
      0,
      realNumberPipelinesToConsider
    );
  }

  /**
   * Counts how many of most recent pipelines failed on this branch in a row
   */
  public getPipelineFailStreak(): number {
    let count: number = 0;
    for (
      let numberPipeline: number = 0;
      numberPipeline < this.pipelines.length;
      numberPipeline++
    ) {
      if (this.pipelines[numberPipeline].isFailure()) {
        count++;
      } else if (this.pipelines[numberPipeline].isComplete()) {
        break;
      }
    }
    console.log(`number pipelines failing on ${this.name} is ${count}`);
    return count;
  }

  public getMostRecentCompletePipeline(): AbstractPipeline | null {
    for (const pipeline of this.pipelines) {
      if (pipeline.isComplete()) {
        return pipeline;
      }
    }
    return null;
  }

  /**
   * Gets name of this pipeline
   */
  public getFullName(): string {
    return this.name;
  }

  /**
   * Gets display name of this pipeline
   */
  public getTruncatedName(): string {
    let truncatedName: string = this.name;
    const seperatedName: string[] = truncatedName.split(Branch.NAME_SEPERATOR);
    if (seperatedName.length >= 3) {
      truncatedName = seperatedName.slice(2).join("");
    }
    return truncatedName.charAt(0).toUpperCase() + truncatedName.slice(1);
  }

  /**
   * Determines given percentile time for task based on durations of task on pipelines on this branch
   * @param percentileToFind Percentile for which to calculate time
   * @param taskName Name of task
   * @param taskId Id of task
   * @param taskType Type of task
   */
  public getPercentileTimeForPipelineTask(
    percentileToFind: number,
    taskName: string,
    taskId: string,
    taskType: string
  ): number {
    const times: number[] = this.getAllPipelineTimesForTask(
      taskName,
      taskId,
      taskType
    );
    tl.debug("times on target for " + taskName + " = " + times.toString());
    if (times.length > 0) {
      return stats.percentile(times, percentileToFind / 100);
    } else {
      console.log(
        "no tasks with name " +
          taskName +
          " found on pipelines of branch " +
          this.name
      );
      return null;
    }
  }

  /**
   * Creates a list of pipelines on this branch that have finished running
   */
  private filterForCompletePipelines(): AbstractPipeline[] {
    const completePipelines: AbstractPipeline[] = [];
    for (const pipeline of this.pipelines) {
      if (pipeline.isComplete()) {
        completePipelines.push(pipeline);
      }
    }
    return completePipelines;
  }

  /**
   * Gathers times across all pipelines on this branch for task with given details
   * @param taskName Name of task to find
   * @param taskId Id of task to find
   * @param taskType Type of task to find
   */
  private getAllPipelineTimesForTask(
    taskName: string,
    taskId: string,
    taskType: string
  ): number[] {
    let times: number[] = [];
    for (const pipeline of this.pipelines) {
      const task: PipelineTask = pipeline.getTask(taskName, taskId, taskType);
      if (task) {
        times = times.concat(task.getAllDurations());
      }
    }
    return times;
  }
}
