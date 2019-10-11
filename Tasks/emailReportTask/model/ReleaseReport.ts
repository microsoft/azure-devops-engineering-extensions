import { Report } from "./Report";
import { Artifact, Release, ReleaseEnvironment, ReleaseTask, DeploymentAttempt, TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { ChangeModel } from "./ChangeModel";
import { PhaseModel } from "./PhaseModel";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { JobModel } from "./JobModel";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { ReleaseViewModel } from "./viewmodel/ReleaseViewModel";
import { isNullOrUndefined } from "util";

export class ReleaseReport extends Report {

  private artifacts: Artifact[] = [];
  private release: Release;
  private environment: ReleaseEnvironment;
  private lastCompletedRelease: Release;
  private lastCompletedEnvironment: ReleaseEnvironment;

  public setReleaseData($release: Release, $environment: ReleaseEnvironment, $lastCompletedRelease: Release, $phases: PhaseModel[], $changes: ChangeModel[], $lastCompletedEnvironment?: ReleaseEnvironment) {
    this.artifacts = $release.artifacts == null ? [] : $release.artifacts;
    this.createdBy = $release.createdBy;
    this.phases = $phases;
    this.associatedChanges = $changes;

    this.release = $release;
    this.environment = $environment;
    this.lastCompletedRelease = $lastCompletedRelease;

    if ($lastCompletedEnvironment == null) {
      if ($lastCompletedRelease != null && $lastCompletedRelease.environments != null) {
        var lastEnvironments = $lastCompletedRelease.environments.filter(e => e.definitionEnvironmentId == $environment.definitionEnvironmentId);
        if (lastEnvironments != null && lastEnvironments.length > 0) {
          this.lastCompletedEnvironment = lastEnvironments[0];
        }
      }
    }
    else {
      this.lastCompletedEnvironment = $lastCompletedEnvironment;
    }
  }

  /**
   * Getter $artifacts
   * @return {Artifact[]}
   */
  public get $artifacts(): Artifact[] {
    return this.artifacts;
  }

  /**
   * Getter $release
   * @return {Release}
   */
  public get $release(): Release {
    return this.release;
  }

  /**
   * Getter $environment
   * @return {ReleaseEnvironment}
   */
  public get $environment(): ReleaseEnvironment {
    return this.environment;
  }

  /**
   * Getter $lastCompletedRelease
   * @return {Release}
   */
  public get $lastCompletedRelease(): Release {
    return this.lastCompletedRelease;
  }

  /**
 * Getter $lastCompletedEnvironment
 * @return {ReleaseEnvironment}
 */
  public get $lastCompletedEnvironment(): ReleaseEnvironment {
    return this.lastCompletedEnvironment;
  }

  public hasPrevGotSameFailures(): boolean {
    const lastId = this.lastCompletedRelease == null ? "null" : this.lastCompletedRelease.id;
    console.log(`Using Last Completed Release: '${lastId}'`);
    if (this.lastCompletedRelease == null || this.$lastCompletedEnvironment == null) {
      return false;
    }

    if (lastId > this.release.id) {
      // We are in a situation where current build completed latter compared to the newer one
      // Newer one would have already evaluated the failures and sent a mail to committers anyway
      // No need to send mail again because there won't be any committers in this mail as associated changes are already evaluated by newer
      // Treat as same failures because it would be noise to M2s and other standard owners in the To-Line
      return true;
    }

    return false;
  }

  public hasFailedTasks(): boolean {
    const tasks = this.getReleaseTasks(this.environment);
    return tasks.filter(task => task.status == TaskStatus.Failed).length > 0;
  }

  public hasPrevFailedTasks(): boolean {
    const tasks = this.getReleaseTasks(this.lastCompletedEnvironment);
    return tasks.filter(task => task.status == TaskStatus.Failed).length > 0;
  }

  public arePrevFailedTasksSame(): boolean {
    const lastTasks = this.getReleaseTasks(this.lastCompletedEnvironment);
    const lastFailedTasks = lastTasks.filter(task => task.status == TaskStatus.Failed);
    var prevfailedTask = lastFailedTasks.length > 0 ? lastFailedTasks[0] : null;

    const currentTasks = this.getReleaseTasks(this.environment);
    const currentFailedTasks = currentTasks.filter(task => task.status == TaskStatus.Failed);
    var currfailedTask = currentFailedTasks.length > 0 ? currentFailedTasks[0] : null;

    const prevfailedTaskName = prevfailedTask == null ? "" : prevfailedTask.name;
    const currfailedTaskName = currfailedTask == null ? "" : currfailedTask.name;
    // if both releases failed without executing any tasks, then they can be null 
    // otherwise, use name matching
    return (prevfailedTask == null && currfailedTask == null) || prevfailedTaskName == currfailedTaskName;
  }

  public getPrevConfig(config: PipelineConfiguration): PipelineConfiguration {
    if(isNullOrUndefined(this.lastCompletedRelease) || isNullOrUndefined(this.lastCompletedEnvironment)) {
      return null;
    }
    var prevConfig = new PipelineConfiguration(
      config.$pipelineType, 
      this.lastCompletedRelease.id,
      config.$projectId, 
      config.$projectName, 
      this.lastCompletedEnvironment.id,
      this.lastCompletedEnvironment.definitionEnvironmentId,
      config.$usePreviousEnvironment, 
      config.$teamUri,
      config.$accessKey);

    return prevConfig;
  }

  public getEnvironmentStatus(): string {
    if (this.hasFailedTasks() || this.hasCanceledPhases()) {
      return "Failed";
    }
    else if (this.hasPartiallySucceededTasks(this.environment)) {
      return "Partially Succeeded";
    }
    else {
      return "Succeeded";
    }
  }

  private hasPartiallySucceededTasks(source: ReleaseEnvironment): boolean {
    if (source == null) {
      return false;
    }
    const tasks = this.getReleaseTasks(source);
    return tasks.filter(t => t.status == TaskStatus.PartiallySucceeded).length > 0;
  }

  public hasCanceledPhases(): boolean {
    if (this.phases == null) {
      return false;
    }
    const jobs: JobModel[] = [];
    this.phases.forEach(p => {
      if (p.$jobs != null) {
        p.$jobs.forEach(j => {
          if (j.$jobStatus == TaskStatus.Canceled) {
            jobs.push(j);
          }
        });
      }
    });
    return jobs.length > 0;
  }

  public getPipelineViewModel(config: PipelineConfiguration): ReleaseViewModel {
    return new ReleaseViewModel(this.environment, config);
  }

  public getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[] {
    var artifacts: ArtifactViewModel[] = [];
    if (this.artifacts != null && this.artifacts.length > 0) {
      this.artifacts.forEach(artifact => {
        artifacts.push(new ArtifactViewModel(artifact, config));
      });
    }

    return artifacts;
  }

  public getReleaseTasks(source: ReleaseEnvironment): ReleaseTask[] {
    const tasks: ReleaseTask[] = [];

    if (source != null && source.deploySteps != null && source.deploySteps.length > 0) {
      let attempt = 0;
      let deploymentAttempt: DeploymentAttempt = source.deploySteps[0];
      for (var i: number = 0; i < source.deploySteps.length; i++) {
        if (source.deploySteps[i].attempt > attempt) {
          deploymentAttempt = source.deploySteps[i];
        }
      }

      deploymentAttempt.releaseDeployPhases.forEach(releaseDeployPhase => {
        releaseDeployPhase.deploymentJobs.forEach(deploymentJob => {
          tasks.push(...deploymentJob.tasks);
        });
      });
    }

    return tasks;
  }
}