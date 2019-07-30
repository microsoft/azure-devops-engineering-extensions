import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import tl = require("azure-pipelines-task-lib/task");

export class PipelineTask {
  private name: string;
  private id: string;
  private type: string;
  private taskRuns: AbstractPipelineTaskRun[];
  private thresholdTime: number;
  private minimumDurationMiliseconds: number;
  private minimumRegressionMilliseconds: number;

  constructor(name: string, id: string, type: string) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.taskRuns = [];
    this.thresholdTime = 0;
    this.minimumDurationMiliseconds = 0;
    this.minimumRegressionMilliseconds = 0;
  }

  public getName(): string {
    return this.name;
  }

  public getId(): string {
    return this.id;
  }

  public getType(): string {
    return this.type;
  }

  /**
   * Adds task runs to this task if runs are determined to be of the same task
   * @param taskInstanceToAdd Runs to add to this task
   */
  public addTaskInstance(taskInstanceToAdd: AbstractPipelineTaskRun): void {
    if (
      this.isMatchingTask(
        taskInstanceToAdd.getName(),
        taskInstanceToAdd.getId(),
        taskInstanceToAdd.getType()
      )
    ) {
      this.taskRuns.push(taskInstanceToAdd);
    }
  }

  /**
   * Sets values for use in determining which runs of task were regressive
   * @param thresholdTime Benchmark time that run should be compared to
   * @param minimumDurationMiliseconds Minimum duration of run for it to potentially be long running
   * @param minimumRegressionMilliseconds Minimum regression of run in comparision to thresholdTime for it to potentially be long running
   */
  public setRegressionStandards(
    thresholdTime: number,
    minimumDurationMiliseconds: number,
    minimumRegressionMilliseconds: number
  ): void {
    this.thresholdTime = thresholdTime;
    this.minimumDurationMiliseconds = minimumDurationMiliseconds;
    this.minimumRegressionMilliseconds = minimumRegressionMilliseconds;
  }

  /**
   * Gets durations of all completed run instances of this task
   */
  public getAllDurations(): number[] {
    const durations: number[] = [];
    for (const run of this.taskRuns) {
      if (run.getDuration()) {
        durations.push(run.getDuration());
      }
    }
    return durations;
  }

  /**
   * Gets longest duration of a run that is regressive based on currently set regression standards for this task
   */
  public getLongestRegressiveDuration(): number {
    return Math.max(...this.getAllRegressiveDurations());
  }

  /**
   * Gets shortest duration of a run that is regressive based on currently set regression standards for this task
   */
  public getShortestRegressiveDuration(): number {
    return Math.min(...this.getAllRegressiveDurations());
  }

  /**
   * Gets longest regression time of a run based on currently set regression standards for this task
   */
  public getLongestRegression(): number {
    return this.getDurationsToRegression().get(
      this.getLongestRegressiveDuration()
    );
  }

  /**
   * Gets shortest regression time of a run based on currently set regression standards for this task
   */
  public getShortestRegression(): number {
    return this.getDurationsToRegression().get(
      this.getShortestRegressiveDuration()
    );
  }

  /**
   * Gets total number of unique agents task has had instances run on
   */
  public getNumberOfAgentsRunOn(): number {
    return this.calculateNumberOfAgentsForGivenRuns(this.taskRuns);
  }

  /**
   * Gets number of unique agents task has had instances that regressed run on based on currently set regression standards
   */
  public getNumberOfAgentsRegressedOn(): number {
    return this.calculateNumberOfAgentsForGivenRuns(
      this.getRegressiveInstances()
    );
  }

  /**
   * Gets currently set regression threshold time
   */
  public getRegressionThreshold(): number {
    return this.thresholdTime;
  }

  /**
   * Determines if this task has had an instance run that failed
   */
  public hasFailedInstance(): boolean {
    for (const run of this.taskRuns) {
      if (run.ran() && run.wasFailure()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determines if this task has had an instance run that regressed based on currently set regression standards
   */
  public hasRegressiveInstances(): boolean {
    return this.getRegressiveInstances().length > 0;
  }

  /**
   * Checks if task matches standards given
   * @param nameToCompare Name with which to compare this task's name
   * @param idToCompare Id with which to compare this task's id
   * @param typeToCompare Type with which to compare this task's type
   */
  public isMatchingTask(
    nameToCompare: string,
    idToCompare: string,
    typeToCompare: string
  ): boolean {
    return (
      this.getName() === nameToCompare &&
      this.getId() === idToCompare &&
      this.getType() === typeToCompare
    );
  }

  /**
   * Determines the number of unique agents for a given set of task runs
   * @param runs Runs of this task for which to determine unique agents
   */
  private calculateNumberOfAgentsForGivenRuns(
    runs: AbstractPipelineTaskRun[]
  ): number {
    const agents: Set<string> = new Set();
    for (const run of runs) {
      agents.add(run.getAgentName());
    }
    return agents.size;
  }

  /**
   * Gathers all durations of runs of this task that are regressive based on currently set regression standards
   */
  private getAllRegressiveDurations(): number[] {
    return Array.from(this.getDurationsToRegression().keys());
  }

  /**
   * Creates a map of regressive durations of runs of this task to their regression time
   */
  private getDurationsToRegression(): Map<number, number> {
    const durationsToRegressions: Map<number, number> = new Map<number, number>();
    for (const run of this.getRegressiveInstances()) {
      durationsToRegressions.set(
        run.getDuration(),
        run.calculateRegression(this.thresholdTime)
      );
    }
    return durationsToRegressions;
  }

  /**
   * Gathers all regressive runs of this task based on currently set regression standards
   */
  private getRegressiveInstances(): AbstractPipelineTaskRun[] {
    const regressiveRuns: AbstractPipelineTaskRun[] = [];
    for (const run of this.taskRuns) {
      if (
        run.isLongRunning(
          this.thresholdTime,
          this.minimumDurationMiliseconds,
          this.minimumRegressionMilliseconds
        )
      ) {
        regressiveRuns.push(run);
      }
    }
    return regressiveRuns;
  }
}
