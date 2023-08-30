"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDataProvider = void 0;
const PipelineNotFoundError_1 = require("../../exceptions/PipelineNotFoundError");
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const PhaseModel_1 = require("../../model/PhaseModel");
const JobModel_1 = require("../../model/JobModel");
const TaskModel_1 = require("../../model/TaskModel");
const IssueModel_1 = require("../../model/IssueModel");
const ReportFactory_1 = require("../../model/ReportFactory");
const BuildInterfaces_1 = require("azure-devops-node-api/interfaces/BuildInterfaces");
const util_1 = require("util");
const RetryablePromise_1 = require("../restclients/RetryablePromise");
const DataProviderError_1 = require("../../exceptions/DataProviderError");
class BuildDataProvider {
    constructor(pipelineRestClient) {
        this.pipelineRestClient = pipelineRestClient;
    }
    getReportDataAsync(pipelineConfig, reportDataConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = ReportFactory_1.ReportFactory.createNewReport(pipelineConfig);
            const build = yield this.getBuildAsync(pipelineConfig);
            if (build == null) {
                throw new PipelineNotFoundError_1.PipelineNotFoundError(`ProjectId: ${pipelineConfig.$projectId}, ${pipelineConfig.$pipelineId}`);
            }
            const timeline = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.pipelineRestClient.getPipelineTimelineAsync(build.id); }), "GetBuildTimeline");
            const changes = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.pipelineRestClient.getPipelineChangesAsync(build.id); }), "GetPipelineChanges");
            const phases = this.getPhases(timeline);
            const lastCompletedBuild = yield this.pipelineRestClient.getLastPipelineAsync(build.definition.id, null, build.sourceBranch);
            const lastCompletedTimeline = lastCompletedBuild != null ? yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.pipelineRestClient.getPipelineTimelineAsync(lastCompletedBuild.id); }), "GetLastCompletedTimeline") : null;
            console.log("Fetched release data");
            report.setBuildData(build, timeline, lastCompletedBuild, lastCompletedTimeline, phases, changes);
            return report;
        });
    }
    getBuildAsync(pipelineConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            var build = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.pipelineRestClient.getPipelineAsync(); }), "GetPipeline");
            if (util_1.isNullOrUndefined(build)) {
                throw new DataProviderError_1.DataProviderError(`Unable to find build with id: ${pipelineConfig.$pipelineId}`);
            }
            return build;
        });
    }
    getPhases(timeline) {
        const records = timeline.records.sort((a, b) => this.getOrder(a) - this.getOrder(b));
        const phases = records.filter(r => r.type == "Phase");
        if (phases.length > 0) {
            const jobs = records.filter(r => r.type == "Job");
            if (jobs.length > 0) {
                const tasks = records.filter(r => r.type == "Task");
                const phaseModels = phases.map(phase => {
                    const jobModels = jobs
                        .filter(j => j.parentId == phase.id)
                        .map(j => {
                        const tasksForThisJob = tasks.filter(t => t.parentId == j.id);
                        const taskModels = tasksForThisJob.map(task => {
                            const issues = util_1.isNullOrUndefined(task.issues) || task.issues.length < 1 ? [] :
                                task.issues.map(i => new IssueModel_1.IssueModel(i.type == BuildInterfaces_1.IssueType.Error ? "Error" : "Warning", i.message));
                            return new TaskModel_1.TaskModel(task.name, this.getTaskState(task.result), issues, task.workerName, task.finishTime, task.startTime);
                        });
                        return new JobModel_1.JobModel(j.name, this.getTaskState(j.result), [], taskModels);
                    });
                    return new PhaseModel_1.PhaseModel(phase.name, jobModels, util_1.isNullOrUndefined(phase.result) ? "Unknown" : phase.result.toString(), this.getOrder(phase));
                });
                return phaseModels;
            }
        }
        return [];
    }
    getTaskState(result) {
        switch (result) {
            case BuildInterfaces_1.TaskResult.Succeeded:
                return ReleaseInterfaces_1.TaskStatus.Succeeded;
            case BuildInterfaces_1.TaskResult.SucceededWithIssues:
                return ReleaseInterfaces_1.TaskStatus.PartiallySucceeded;
            case BuildInterfaces_1.TaskResult.Failed:
                return ReleaseInterfaces_1.TaskStatus.Failed;
            case BuildInterfaces_1.TaskResult.Canceled:
                return ReleaseInterfaces_1.TaskStatus.Canceled;
            case BuildInterfaces_1.TaskResult.Skipped:
                return ReleaseInterfaces_1.TaskStatus.Skipped;
            default:
                return ReleaseInterfaces_1.TaskStatus.Unknown;
        }
    }
    getOrder(timelineRecord) {
        return util_1.isNullOrUndefined(timelineRecord.order) ? 0 : timelineRecord.order;
    }
}
exports.BuildDataProvider = BuildDataProvider;
//# sourceMappingURL=BuildDataProvider.js.map