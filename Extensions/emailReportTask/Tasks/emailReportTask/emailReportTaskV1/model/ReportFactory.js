"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFactory = void 0;
const ReleaseReport_1 = require("./ReleaseReport");
const PipelineType_1 = require("../config/pipeline/PipelineType");
const BuildReport_1 = require("./BuildReport");
class ReportFactory {
    static createNewReport(pipelineConfig) {
        return (pipelineConfig.$pipelineType == PipelineType_1.PipelineType.Build) ? new BuildReport_1.BuildReport() : new ReleaseReport_1.ReleaseReport();
    }
    static mergeReports(reports) {
        if (reports == null || reports.length == 0)
            return null;
        if (reports.length == 1)
            return reports[0];
        let finalReport = reports[0];
        for (var i = 1; i < reports.length; i++) {
            finalReport = ReportFactory.mergeTwoReports(finalReport, reports[i]);
        }
        return finalReport;
    }
    static mergeTwoReports(source, target) {
        let associatedChanges = [];
        let phases = [];
        if (target.$testSummaryGroups != null) {
            source.$testSummaryGroups.push(...target.$testSummaryGroups);
        }
        if (target.$associatedChanges != null) {
            associatedChanges = target.$associatedChanges;
        }
        if (target.$failedTestOwners != null) {
            source.$failedTestOwners.push(...target.$failedTestOwners);
        }
        if (target.filteredResults != null) {
            source.filteredResults = target.filteredResults;
        }
        if (target.hasFilteredTests) {
            source.hasFilteredTests = target.hasFilteredTests;
        }
        if (target.testResultSummary != null) {
            source.testResultSummary = target.testResultSummary;
        }
        if (target.$phases != null) {
            phases = target.$phases;
        }
        if (source instanceof ReleaseReport_1.ReleaseReport) {
            var releaseTarget = target;
            var releaseSource = source;
            let targetRelease = null;
            let targetEnv = null;
            let targetLastRelease = null;
            let targetLastEnv = null;
            if (releaseTarget.$release != null) {
                targetRelease = releaseTarget.$release;
            }
            if (releaseTarget.$environment != null) {
                targetEnv = releaseTarget.$environment;
            }
            if (releaseTarget.$lastCompletedEnvironment != null) {
                targetLastRelease = releaseTarget.$lastCompletedRelease;
            }
            if (releaseTarget.$lastCompletedEnvironment != null) {
                targetLastEnv = releaseTarget.$lastCompletedEnvironment;
            }
            if (targetRelease != null) {
                releaseSource.setReleaseData(targetRelease, targetEnv, targetLastRelease, phases, associatedChanges, targetLastEnv);
            }
        }
        return source;
    }
}
exports.ReportFactory = ReportFactory;
//# sourceMappingURL=ReportFactory.js.map