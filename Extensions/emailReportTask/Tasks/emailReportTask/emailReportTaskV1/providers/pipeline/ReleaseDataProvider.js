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
exports.ReleaseDataProvider = void 0;
const PipelineNotFoundError_1 = require("../../exceptions/PipelineNotFoundError");
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const DataProviderError_1 = require("../../exceptions/DataProviderError");
const PhaseModel_1 = require("../../model/PhaseModel");
const EnvironmentExtensions_1 = require("../../utils/EnvironmentExtensions");
const JobModel_1 = require("../../model/JobModel");
const TaskModel_1 = require("../../model/TaskModel");
const IssueModel_1 = require("../../model/IssueModel");
const ReportFactory_1 = require("../../model/ReportFactory");
const RetryablePromise_1 = require("../restclients/RetryablePromise");
const util_1 = require("util");
class ReleaseDataProvider {
    constructor(pipelineRestClient) {
        this.pipelineRestClient = pipelineRestClient;
    }
    getReportDataAsync(pipelineConfig, reportDataConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = ReportFactory_1.ReportFactory.createNewReport(pipelineConfig);
            const release = yield this.getReleaseAsync(pipelineConfig);
            if (release == null) {
                throw new PipelineNotFoundError_1.PipelineNotFoundError(`ProjectId: ${pipelineConfig.$projectId}, ${pipelineConfig.$pipelineId}`);
            }
            const environment = this.getEnvironment(release, pipelineConfig);
            const phases = this.getPhases(environment);
            const lastCompletedRelease = yield this.getReleaseByLastCompletedEnvironmentAsync(pipelineConfig, release, environment);
            let changes = [];
            // check if last completed one isn't latter one, then changes don't make sense
            if (lastCompletedRelease != null && lastCompletedRelease.id < release.id) {
                console.log(`Getting changes between releases ${release.id} & ${lastCompletedRelease.id}`);
                try {
                    changes = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.pipelineRestClient.getPipelineChangesAsync(lastCompletedRelease.id); }), "GetPipelineChanges");
                }
                catch (err) {
                    // Changes happened in current release w.r.t previous one isn't strictly required to send mail - ignoring any errors
                    console.warn(`Error while comparing current release - '${release.id}' with previous one - '${lastCompletedRelease.id}': ${err}`);
                }
            }
            else {
                console.log("Unable to find any last completed release");
            }
            console.log("Fetched release data");
            report.setReleaseData(release, environment, lastCompletedRelease, phases, changes);
            return report;
        });
    }
    getReleaseAsync(pipelineConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            var release = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.pipelineRestClient.getPipelineAsync(); }), "GetPipeline");
            if (util_1.isNullOrUndefined(release)) {
                throw new DataProviderError_1.DataProviderError(`Unable to find release with release id: ${pipelineConfig.$pipelineId}`);
            }
            return release;
        });
    }
    getEnvironment(release, pipelineConfig) {
        let environment;
        const environments = release.environments;
        for (var i = 0; i < environments.length; i++) {
            if (environments[i].id == pipelineConfig.$environmentId) {
                environment = environments[i];
                break;
            }
        }
        if (pipelineConfig.$usePreviousEnvironment && environments.indexOf(environment) > 0) {
            environment = environments[environments.indexOf(environment) - 1];
        }
        if (environment != null) {
            return environment;
        }
        throw new DataProviderError_1.DataProviderError(`Unable to find environment with environment id - ${pipelineConfig.$environmentId} in release - ${release.id}`);
    }
    getPhases(environment) {
        var releaseDeployPhases = EnvironmentExtensions_1.EnvironmentExtensions.getPhases(environment);
        return releaseDeployPhases.map(r => new PhaseModel_1.PhaseModel(r.name, this.getJobModelsFromPhase(r.deploymentJobs), ReleaseInterfaces_1.DeployPhaseStatus[r.status], r.rank));
    }
    getJobModelsFromPhase(deploymentJobs) {
        const jobModels = deploymentJobs.map(job => {
            const issues = job.job.issues.map(i => new IssueModel_1.IssueModel(i.issueType, i.message));
            const tasks = job.tasks.map(t => {
                const issues = t.issues.map(i => new IssueModel_1.IssueModel(i.issueType, i.message));
                return new TaskModel_1.TaskModel(t.name, t.status, issues, t.agentName, t.finishTime, t.startTime);
            });
            return new JobModel_1.JobModel(job.job.name, job.job.status, issues, tasks);
        });
        return jobModels;
    }
    getReleaseByLastCompletedEnvironmentAsync(pipelineConfig, release, environment) {
        return __awaiter(this, void 0, void 0, function* () {
            let branchId = null;
            if (release.artifacts != null && release.artifacts.length > 0) {
                const primaryArtifact = release.artifacts.filter(a => a.isPrimary)[0];
                const defRef = primaryArtifact.definitionReference["branch"];
                branchId = defRef != null ? defRef.id : null;
            }
            console.log(`Fetching last release by completed environment id - ${pipelineConfig.$environmentId} and branch id ${branchId}`);
            const lastRelease = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () {
                return this.pipelineRestClient.getLastPipelineAsync(release.releaseDefinition.id, environment.definitionEnvironmentId, branchId, null);
            }), "GetLastCompletedPipeline"); //Bug in API - release.createdOn);
            return lastRelease;
        });
    }
}
exports.ReleaseDataProvider = ReleaseDataProvider;
//# sourceMappingURL=ReleaseDataProvider.js.map