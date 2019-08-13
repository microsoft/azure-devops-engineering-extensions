import { Build, Timeline, TaskResult, TimelineRecord } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Report } from "./Report";
import { isNullOrUndefined } from "util";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { PipelineViewModel } from "./viewmodel/PipelineViewModel";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { PipelineType } from "../config/pipeline/PipelineType";
import { BuildReferenceViewModel } from "./viewmodel/BuildReferenceViewModel";
import { PhaseModel } from "./PhaseModel";
import { ChangeModel } from "./ChangeModel";

export class BuildReport extends Report {
  private build: Build;
  private timeline: Timeline;
  private lastCompletedBuild: Build;
  private lastCompletedTimeline: Timeline;

  setBuildData($build: Build, $timeline: Timeline, $lastCompletedBuild: Build, $lastCompletedTimeline: Timeline, $phases: PhaseModel[], $changes: ChangeModel[]) {
    this.build = $build;
    this.timeline = $timeline;
    this.lastCompletedBuild = $lastCompletedBuild;
    this.lastCompletedTimeline = $lastCompletedTimeline;
    this.phases = $phases;
    this.associatedChanges = $changes;
  }

  public hasPrevGotSameFailures(): boolean {
    if (this.lastCompletedBuild == null) {
      return false;
    }
    console.log(`Using Last Completed Build: '${this.lastCompletedBuild.id}'.`);

    if (this.lastCompletedBuild.id > this.build.id) {
      // We are in a situation where current build completed latter compared to the newer one
      // Newer one would have already evaluated the failures and sent a mail to committers anyway
      // No need to send mail again because there won't be any committers in this mail as associated changes are already evaluated by newer
      // Treat as same failures because it would be noise to M2s and other standard owners in the To-Line
      return true;
    }

    return null;
  }

  public hasFailedTasks(): boolean {
    return this.timelineHasFailedTasks(this.timeline);
  }

  public hasPrevFailedTasks(): boolean {
    return this.timelineHasFailedTasks(this.lastCompletedTimeline);
  }

  public arePrevFailedTasksSame(): boolean {
    var prevfailedTask = this.getTasksByResultinTimeline(this.lastCompletedTimeline, TaskResult.Failed)[0];
    var currentFailedTask = this.getTasksByResultinTimeline(this.timeline, TaskResult.Failed)[0];

    // if both releases failed without executing any tasks, then they can be null 
    // otherwise, use name matching
    return (prevfailedTask == null && currentFailedTask == null)
      || (!isNullOrUndefined(prevfailedTask) && !isNullOrUndefined(currentFailedTask) && prevfailedTask.name.toLowerCase() == currentFailedTask.name.toLowerCase());
  }

  public getPrevConfig(config: PipelineConfiguration): PipelineConfiguration {
    var buildConfig = new PipelineConfiguration(PipelineType.Build,
      this.lastCompletedBuild.id,
      config.$projectId,
      config.$projectName,
      null,
      null,
      config.$usePreviousEnvironment,
      config.$teamUri,
      config.$accessKey);

    return buildConfig;
  }

  public getEnvironmentStatus(): string {
    if (this.hasFailedTasks()) {
      return "Failed";
    }
    else if (this.getTasksByResultinTimeline(this.timeline, TaskResult.SucceededWithIssues).length > 0) {
      return "Partially Succeeded";
    }
    else {
      return "Succeeded";
    }
  }

  public getPipelineViewModel(config: PipelineConfiguration): PipelineViewModel {
    return new BuildReferenceViewModel(config, null, this.build);
  }

  public getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[] {
    return [];
  }

  public hasCanceledPhases(): boolean {
    return false;
  }

  private timelineHasFailedTasks(timeLine: Timeline): boolean {
    return this.getTasksByResultinTimeline(timeLine, TaskResult.Failed).length > 0;
  }

  private getTasksByResultinTimeline(timeLine: Timeline, taskResult: TaskResult): TimelineRecord[] {
    return this.timeline == null || this.timeline.records == null ? [] : this.timeline.records.filter(r => r.result == taskResult);
  }
}