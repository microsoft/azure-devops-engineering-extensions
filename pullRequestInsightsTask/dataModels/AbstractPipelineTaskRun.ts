import tl = require("azure-pipelines-task-lib/task");
import { ITaskReference } from "./ITaskReference";

export abstract class AbstractPipelineTaskRun {
  private name: string;
  private id: string;
  private type: string;
  private startTime: Date;
  private finishTime: Date;
  private agentName: string;

  constructor(
    taskRunReference: ITaskReference,
    name: string,
    startTime: Date,
    finishTime: Date,
    agentName: string
  ) {
    this.name = name;
    this.id = null;
    this.type = null;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.agentName = agentName;
    if (taskRunReference) {
      this.id = taskRunReference.id;
      this.type = taskRunReference.name;
    }
  }

  /**
   * Determines if task run has a status implying completion
   */
  protected abstract hasCompleteStatus(): boolean;

  /**
   * Determines if task run has failed
   */
  public abstract wasFailure(): boolean;

  /**
   * Gets name of task run
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gets id of task run
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Gets name of agent task run ran on
   */
  public getAgentName(): string {
    return this.agentName;
  }

  /**
   * Determines if task run was long running based on its duration in comparision to input standards
   * @param thresholdTime Benchmark time that run should be compared to
   * @param minimumDurationMiliseconds Minimum duration of run for it to potentially be long running
   * @param minimumRegressionMilliseconds Minimum regression of run in comparision to thresholdTime for it to potentially be long running
   */
  public isLongRunning(
    thresholdTime: number,
    minimumDurationMiliseconds: number,
    minimumRegressionMilliseconds: number
  ): boolean {
    let taskLength: number = this.getDuration();
    if (
      thresholdTime &&
      taskLength &&
      this.getDuration() > minimumDurationMiliseconds &&
      this.hasSignificantRegression(
        thresholdTime,
        minimumRegressionMilliseconds
      )
    ) {
      return true;
    }
    return false;
  }

  /**
   * Gets length of task instance run based on start and finish time, return null if task has not completed
   */
  public getDuration(): number {
    if (this.ran()) {
      return (
        this.getTimeFromDate(this.finishTime) -
        this.getTimeFromDate(this.startTime)
      );
    }
    return null;
  }

  /**
   * Determines if this instance completed running
   */
  public ran(): boolean {
    return (
      this.hasCompleteStatus() &&
      this.startTime != null &&
      this.finishTime != null
    );
  }

  /**
   * Gets the regression of the task run based on a threshold
   * @param thresholdTime Time to base regression off
   */
  public calculateRegression(thresholdTime: number): number {
    return this.getDuration() - thresholdTime;
  }

  /**
   * Gets type of task run based on task reference
   */
  public getType(): string {
    if (this.type) {
      return this.type.toLowerCase();
    }
    return null;
  }

  /**
   * Determines if regression from thresholdTime is significant based on minimum regression given
   * @param thresholdTime Time to base regression off
   * @param minimumRegressionMilliseconds Minimum regression duration for regression to be significant
   */
  private hasSignificantRegression(
    thresholdTime: number,
    minimumRegressionMilliseconds: number
  ): boolean {
    return (
      this.calculateRegression(thresholdTime) > minimumRegressionMilliseconds
    );
  }

  /**
   * Gets amount of milliseconds from a Date, returns null if date is not given
   * @param date Date to get milliseconds from
   */
  private getTimeFromDate(date: Date): number {
    if (date) {
      return date.getTime();
    }
    return null;
  }
}
