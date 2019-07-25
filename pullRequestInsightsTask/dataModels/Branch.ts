import { AbstractPipeline } from "./AbstractPipeline";
import tl = require("azure-pipelines-task-lib/task");
import stats from "stats-lite";
import { PipelineTask } from "./PipelineTask";

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
    tl.debug(
      "Number of retrieved pipelines for " +
        this.name +
        " = " +
        this.pipelines.length
    );
  }

  /**
   * Determines if this branch is healthy based on pipelines on its pipelines
   * @param numberPipelinesToConsider Number of past pipelines to use to determine health
   */
  public isHealthy(numberPipelinesToConsider: number): boolean {
    const pipelinesToConsider: AbstractPipeline[] = [];
    if (this.pipelines) {
      for (const pipeline of this.pipelines) {
        if (pipeline.isComplete()) {
          pipelinesToConsider.push(pipeline);
        } else {
          tl.debug(
            "not considering the health of " +
              pipeline.getDisplayName() +
              " because it is not complete"
          );
        }
      }
      numberPipelinesToConsider = Math.min(
        pipelinesToConsider.length,
        numberPipelinesToConsider
      );
      for (
        let numberPipeline: number = 0;
        numberPipeline < numberPipelinesToConsider;
        numberPipeline++
      ) {
        tl.debug(
          "considering pipeline " +
            pipelinesToConsider[numberPipeline].getDisplayName()
        );
        tl.debug(
          pipelinesToConsider[numberPipeline].getDisplayName() +
            " is a failure? " +
            pipelinesToConsider[numberPipeline].isFailure()
        );
        if (pipelinesToConsider[numberPipeline].isFailure()) {
          return false;
        }
      }
    }
    return true;
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
    tl.debug(`number pipelines failing on ${this.name} is ${count}`);
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
      tl.debug(
        "no tasks with name " +
          taskName +
          " found on pipelines of branch " +
          this.name
      );
      return null;
    }
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
