import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import tl = require("azure-pipelines-task-lib/task");
import { PipelineTask } from "./PipelineTask";
import { AbstractAzureApi } from "../dataProviders/AbstractAzureApi";

export abstract class AbstractPipeline {
  private tasks: PipelineTask[];

  constructor() {
    this.tasks = [];
  }

  /**
   * Adds runs of tasks to this pipeline by searching for the existing task to add the instance to or creating a new task
   * @param allTaskRuns task runs to add to pipeline
   */
  protected addTaskRuns(allTaskRuns: AbstractPipelineTaskRun[]): void {
    for (const taskRun of allTaskRuns) {
      let task: PipelineTask = this.getTask(
        taskRun.getName(),
        taskRun.getId(),
        taskRun.getType()
      );
      if (!task) {
        task = new PipelineTask(
          taskRun.getName(),
          taskRun.getId(),
          taskRun.getType()
        );
        this.tasks.push(task);
      }
      task.addTaskInstance(taskRun);
    }
  }

  /**
   * Gets id of pipeline definition
   */
  public abstract getDefinitionId(): number;

  /**
   * Gets name of pipeline definition
   */
  public abstract getDefinitionName(): string;

  /**
   * Gets web link to pipeline definition
   * @param apiCaller Object with ability to make calls for AzureDevOps data
   * @param project Name of project pipeline is running within
   */
  public abstract getDefinitionLink(
    apiCaller: AbstractAzureApi,
    project: string
  ): Promise<string>;

  /**
   * Determines if pipeline has already or will fail based on tasks already completed
   */
  public abstract isFailure(): boolean;

  /**
   * Determines if pipeline has finished
   */
  public abstract isComplete(): boolean;

  /**
   * Gets web link to pipeline page
   */
  public abstract getLink(): string;

  /**
   * Gets pipeline id
   */
  public abstract getId(): number;

  /**
   * Gets pipeline name that is helpful to display to user
   */
  public abstract getName(): string;

  public abstract getTriggeringArtifactAlias(): string;

  public abstract getBuildIdFromArtifact(artifactAlias: string): number;

  /**
   * Gets all tasks added to this pipeline
   */
  public getTasks(): PipelineTask[] {
    if (!this.tasks) {
      return [];
    }
    return this.tasks;
  }

  /**
   * Gets specific task from this pipeline, if not present, returns null
   * @param name Name of task to get
   * @param id Id of task to get
   * @param type Type of task to get
   */
  public getTask(name: string, id: string, type: string): PipelineTask {
    for (const task of this.getTasks()) {
      if (task.isMatchingTask(name, id, type)) {
        return task;
      }
    }
    return null;
  }

  /**
   * Determines if any task runs have failed on pipeline
   */
  protected taskFailedDuringRun(): boolean {
    for (const task of this.getTasks()) {
      if (task.hasFailedInstance()) {
        return true;
      }
    }
    return false;
  }
}
