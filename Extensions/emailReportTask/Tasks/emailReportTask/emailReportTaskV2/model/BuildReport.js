"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildReport = void 0;
const BuildInterfaces_1 = require("azure-devops-node-api/interfaces/BuildInterfaces");
const Report_1 = require("./Report");
const util_1 = require("util");
const PipelineConfiguration_1 = require("../config/pipeline/PipelineConfiguration");
const PipelineType_1 = require("../config/pipeline/PipelineType");
const BuildReferenceViewModel_1 = require("./viewmodel/BuildReferenceViewModel");
class BuildReport extends Report_1.Report {
    setBuildData($build, $timeline, $lastCompletedBuild, $lastCompletedTimeline, $phases, $changes) {
        this.build = $build;
        this.timeline = $timeline;
        this.lastCompletedBuild = $lastCompletedBuild;
        this.lastCompletedTimeline = $lastCompletedTimeline;
        this.phases = $phases;
        this.associatedChanges = $changes;
    }
    hasPrevGotSameFailures() {
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
    hasFailedTasks() {
        return this.timelineHasFailedTasks(this.timeline);
    }
    hasPrevFailedTasks() {
        return this.timelineHasFailedTasks(this.lastCompletedTimeline);
    }
    arePrevFailedTasksSame() {
        var prevfailedTask = this.getTasksByResultinTimeline(this.lastCompletedTimeline, BuildInterfaces_1.TaskResult.Failed)[0];
        var currentFailedTask = this.getTasksByResultinTimeline(this.timeline, BuildInterfaces_1.TaskResult.Failed)[0];
        // if both releases failed without executing any tasks, then they can be null 
        // otherwise, use name matching
        return (prevfailedTask == null && currentFailedTask == null)
            || (!util_1.isNullOrUndefined(prevfailedTask) && !util_1.isNullOrUndefined(currentFailedTask) && prevfailedTask.name.toLowerCase() == currentFailedTask.name.toLowerCase());
    }
    getPrevConfig(config) {
        var buildConfig = new PipelineConfiguration_1.PipelineConfiguration(PipelineType_1.PipelineType.Build, this.lastCompletedBuild.id, config.$projectId, config.$projectName, null, null, config.$usePreviousEnvironment, config.$teamUri, config.$accessKey);
        return buildConfig;
    }
    getEnvironmentStatus() {
        if (this.hasFailedTasks()) {
            return "Failed";
        }
        else if (this.getTasksByResultinTimeline(this.timeline, BuildInterfaces_1.TaskResult.SucceededWithIssues).length > 0) {
            return "Partially Succeeded";
        }
        else {
            return "Succeeded";
        }
    }
    getPipelineViewModel(config) {
        return new BuildReferenceViewModel_1.BuildReferenceViewModel(config, null, this.build);
    }
    getArtifactViewModels(config) {
        return [];
    }
    hasCanceledPhases() {
        return false;
    }
    timelineHasFailedTasks(timeLine) {
        return this.getTasksByResultinTimeline(timeLine, BuildInterfaces_1.TaskResult.Failed).length > 0;
    }
    getTasksByResultinTimeline(timeLine, taskResult) {
        return this.timeline == null || this.timeline.records == null ? [] : this.timeline.records.filter(r => r.result == taskResult);
    }
}
exports.BuildReport = BuildReport;
//# sourceMappingURL=BuildReport.js.map