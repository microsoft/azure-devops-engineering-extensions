"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseReport = void 0;
const Report_1 = require("./Report");
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const PipelineConfiguration_1 = require("../config/pipeline/PipelineConfiguration");
const ArtifactViewModel_1 = require("./viewmodel/ArtifactViewModel");
const ReleaseViewModel_1 = require("./viewmodel/ReleaseViewModel");
const util_1 = require("util");
class ReleaseReport extends Report_1.Report {
    constructor() {
        super(...arguments);
        this.artifacts = [];
    }
    setReleaseData($release, $environment, $lastCompletedRelease, $phases, $changes, $lastCompletedEnvironment) {
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
    get $artifacts() {
        return this.artifacts;
    }
    /**
     * Getter $release
     * @return {Release}
     */
    get $release() {
        return this.release;
    }
    /**
     * Getter $environment
     * @return {ReleaseEnvironment}
     */
    get $environment() {
        return this.environment;
    }
    /**
     * Getter $lastCompletedRelease
     * @return {Release}
     */
    get $lastCompletedRelease() {
        return this.lastCompletedRelease;
    }
    /**
   * Getter $lastCompletedEnvironment
   * @return {ReleaseEnvironment}
   */
    get $lastCompletedEnvironment() {
        return this.lastCompletedEnvironment;
    }
    hasPrevGotSameFailures() {
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
        return null;
    }
    hasFailedTasks() {
        const tasks = this.getReleaseTasks(this.environment);
        return tasks.filter(task => task.status == ReleaseInterfaces_1.TaskStatus.Failed).length > 0;
    }
    hasPrevFailedTasks() {
        const tasks = this.getReleaseTasks(this.lastCompletedEnvironment);
        return tasks.filter(task => task.status == ReleaseInterfaces_1.TaskStatus.Failed).length > 0;
    }
    arePrevFailedTasksSame() {
        const lastTasks = this.getReleaseTasks(this.lastCompletedEnvironment);
        const lastFailedTasks = lastTasks.filter(task => task.status == ReleaseInterfaces_1.TaskStatus.Failed);
        var prevfailedTask = lastFailedTasks.length > 0 ? lastFailedTasks[0] : null;
        const currentTasks = this.getReleaseTasks(this.environment);
        const currentFailedTasks = currentTasks.filter(task => task.status == ReleaseInterfaces_1.TaskStatus.Failed);
        var currfailedTask = currentFailedTasks.length > 0 ? currentFailedTasks[0] : null;
        const prevfailedTaskName = prevfailedTask == null ? "" : prevfailedTask.name;
        const currfailedTaskName = currfailedTask == null ? "" : currfailedTask.name;
        // if both releases failed without executing any tasks, then they can be null 
        // otherwise, use name matching
        return (prevfailedTask == null && currfailedTask == null) || prevfailedTaskName == currfailedTaskName;
    }
    getPrevConfig(config) {
        if (util_1.isNullOrUndefined(this.lastCompletedRelease) || util_1.isNullOrUndefined(this.lastCompletedEnvironment)) {
            return null;
        }
        var prevConfig = new PipelineConfiguration_1.PipelineConfiguration(config.$pipelineType, this.lastCompletedRelease.id, config.$projectId, config.$projectName, this.lastCompletedEnvironment.id, this.lastCompletedEnvironment.definitionEnvironmentId, config.$usePreviousEnvironment, config.$teamUri, config.$accessKey);
        return prevConfig;
    }
    getEnvironmentStatus() {
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
    hasPartiallySucceededTasks(source) {
        if (source == null) {
            return false;
        }
        const tasks = this.getReleaseTasks(source);
        return tasks.filter(t => t.status == ReleaseInterfaces_1.TaskStatus.PartiallySucceeded).length > 0;
    }
    hasCanceledPhases() {
        if (this.phases == null) {
            return false;
        }
        const jobs = [];
        this.phases.forEach(p => {
            if (p.$jobs != null) {
                p.$jobs.forEach(j => {
                    if (j.$jobStatus == ReleaseInterfaces_1.TaskStatus.Canceled) {
                        jobs.push(j);
                    }
                });
            }
        });
        return jobs.length > 0;
    }
    getPipelineViewModel(config) {
        return new ReleaseViewModel_1.ReleaseViewModel(this.environment, config);
    }
    getArtifactViewModels(config) {
        var artifacts = [];
        if (this.artifacts != null && this.artifacts.length > 0) {
            this.artifacts.forEach(artifact => {
                artifacts.push(new ArtifactViewModel_1.ArtifactViewModel(artifact, config));
            });
        }
        return artifacts;
    }
    getReleaseTasks(source) {
        const tasks = [];
        if (source != null && source.deploySteps != null && source.deploySteps.length > 0) {
            let attempt = 0;
            let deploymentAttempt = source.deploySteps[0];
            for (var i = 0; i < source.deploySteps.length; i++) {
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
exports.ReleaseReport = ReleaseReport;
//# sourceMappingURL=ReleaseReport.js.map