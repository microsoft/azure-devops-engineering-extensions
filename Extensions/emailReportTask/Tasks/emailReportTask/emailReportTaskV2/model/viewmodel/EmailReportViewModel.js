"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailReportViewModel = void 0;
const util_1 = require("util");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const LinkHelper_1 = require("../helpers/LinkHelper");
const PhaseViewModel_1 = require("./PhaseViewModel");
const PhaseIssuesViewModel_1 = require("./PhaseIssuesViewModel");
const TestResultSummaryViewModel_1 = require("./TestResultSummaryViewModel");
const TestResultsHelper_1 = require("../helpers/TestResultsHelper");
const ArtifactViewModel_1 = require("./ArtifactViewModel");
const ChangeViewModel_1 = require("./ChangeViewModel");
const TestSummaryGroupViewModel_1 = require("./TestSummaryGroupViewModel");
const TestResultsGroupViewModel_1 = require("./TestResultsGroupViewModel");
const PipelineType_1 = require("../../config/pipeline/PipelineType");
class EmailReportViewModel {
    constructor(report, reportConfiguration) {
        this.ProjectName = reportConfiguration.$pipelineConfiguration.$projectName;
        this.HasTaskFailures = report.hasFailedTasks();
        if (reportConfiguration.$pipelineConfiguration.$pipelineType == PipelineType_1.PipelineType.Build) {
            this.Build = report.getPipelineViewModel(reportConfiguration.$pipelineConfiguration);
        }
        else {
            this.Release = report.getPipelineViewModel(reportConfiguration.$pipelineConfiguration);
        }
        this.Artifacts = new ArtifactViewModel_1.ArtifactViewModelWrapper();
        this.Artifacts.ArtifactViewModel = report.getArtifactViewModels(reportConfiguration.$pipelineConfiguration);
        this.HasCanceledPhases = report.hasCanceledPhases();
        this.InitializePhases(report);
        this.SetMailSubject(report, reportConfiguration);
        this.HasFailedTests = report.hasFailedTests(reportConfiguration.$reportDataConfiguration.$includeOthersInTotal);
        if (report.testResultSummary != null) {
            this.AllTests = new TestResultSummaryViewModel_1.TestResultSummaryViewModel(null, report.testResultSummary, reportConfiguration.$pipelineConfiguration, reportConfiguration.$reportDataConfiguration.$includeOthersInTotal);
        }
        this.InitializeSummaryGroupViewModel(report, reportConfiguration);
        this.ShowAssociatedChanges = reportConfiguration.$reportDataConfiguration.$includeCommits;
        if (this.ShowAssociatedChanges) {
            this.InitializeAssociatedChanges(report, reportConfiguration.$pipelineConfiguration);
        }
        this.InitializeTestResultGroups(report, reportConfiguration);
        this.TestTabLink = LinkHelper_1.LinkHelper.getTestTabLink(reportConfiguration.$pipelineConfiguration);
        this.DataMissing = report.$dataMissing;
    }
    InitializePhases(report) {
        const phases = [];
        if (util_1.isNullOrUndefined(report.$phases) || report.$phases.length < 1) {
            return;
        }
        report.$phases.forEach(phase => {
            phases.push(new PhaseViewModel_1.PhaseViewModel(phase));
        });
        this.Phases = new PhaseViewModel_1.PhaseViewModelWrapper();
        this.Phases.PhaseViewModel = phases;
        if (this.HasCanceledPhases) {
            this.PhaseIssuesSummary = new PhaseIssuesViewModel_1.PhaseIssuesViewModel(report.$phases);
        }
    }
    SetMailSubject(report, reportConfig) {
        var subject = reportConfig.$mailConfiguration.$mailSubject;
        if (subject.includes("{passPercentage}")) {
            var passPercentage = this.GetPassPercentage(report, reportConfig.$reportDataConfiguration.$includeOthersInTotal);
            subject = subject.replace("{passPercentage}", passPercentage);
        }
        if (subject.includes("{environmentStatus}")) {
            subject = subject.replace("{environmentStatus}", report.getEnvironmentStatus());
        }
        reportConfig.$mailConfiguration.$mailSubject = subject;
    }
    InitializeAssociatedChanges(report, pipelineConfig) {
        if (!util_1.isNullOrUndefined(report.$associatedChanges) && report.$associatedChanges.length > 0) {
            this.AssociatedChanges = new ChangeViewModel_1.ChangeViewModelWrapper();
            this.AssociatedChanges.ChangeViewModel = [];
            report.$associatedChanges.forEach(associatedChange => {
                this.AssociatedChanges.ChangeViewModel.push(new ChangeViewModel_1.ChangeViewModel(associatedChange, pipelineConfig));
            });
        }
    }
    InitializeSummaryGroupViewModel(report, reportConfiguration) {
        this.SummaryGroups = new TestSummaryGroupViewModel_1.TestSummaryGroupViewModelWrapper();
        this.SummaryGroups.TestSummaryGroupViewModel = [];
        if (!util_1.isNullOrUndefined(report.$testSummaryGroups)) {
            report.$testSummaryGroups.forEach(summaryGroup => {
                reportConfiguration.$reportDataConfiguration.$groupTestSummaryBy.forEach(group => {
                    if (summaryGroup.groupedBy == group) {
                        console.log(`Creating summary group viewmodel for ${summaryGroup.groupedBy}`);
                        this.SummaryGroups.TestSummaryGroupViewModel.push(new TestSummaryGroupViewModel_1.TestSummaryGroupViewModel(summaryGroup, reportConfiguration.$pipelineConfiguration, reportConfiguration.$reportDataConfiguration.$includeOthersInTotal));
                    }
                });
            });
        }
    }
    InitializeTestResultGroups(report, reportConfig) {
        this.TestResultsGroups = new TestResultsGroupViewModel_1.TestResultsGroupViewModelWrapper();
        this.TestResultsGroups.TestResultsGroupViewModel = [];
        if (report.filteredResults != null) {
            report.filteredResults.forEach(testResultGroupModel => {
                var testResultsGroupViewModel = new TestResultsGroupViewModel_1.TestResultsGroupViewModel(testResultGroupModel, reportConfig);
                this.TestResultsGroups.TestResultsGroupViewModel.push(testResultsGroupViewModel);
            });
        }
        this.HasFilteredTests = report.hasFilteredTests;
        if (this.TestResultsGroups.TestResultsGroupViewModel.length > 0) {
            const testResultsConfig = reportConfig.$reportDataConfiguration.$testResultsConfig;
            if (testResultsConfig.$includePassedTests) {
                this.HasTestResultsToShow = this.HasTestResultsToShow || this.TestResultsGroups.TestResultsGroupViewModel.filter(t => t.PassedTests.TestResultViewModel.length > 0).length > 0;
            }
            if (testResultsConfig.$includeFailedTests) {
                this.HasTestResultsToShow = this.HasTestResultsToShow || this.TestResultsGroups.TestResultsGroupViewModel.filter(t => t.FailedTests.TestResultViewModel.length > 0).length > 0;
            }
            if (testResultsConfig.$includeOtherTests) {
                this.HasTestResultsToShow = this.HasTestResultsToShow || this.TestResultsGroups.TestResultsGroupViewModel.filter(t => t.OtherTests.TestResultViewModel.length > 0).length > 0;
            }
        }
    }
    GetPassPercentage(report, includeOthersInTotal) {
        var summary = report.testResultSummary;
        let passedTests = 0, totalTests = 0;
        if (summary != null) {
            const passedTestsAggregation = report.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[TestInterfaces_1.TestOutcome.Passed];
            passedTests = util_1.isNullOrUndefined(passedTestsAggregation) ? 0 : passedTestsAggregation.count;
            const failedTestsAggregation = report.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[TestInterfaces_1.TestOutcome.Failed];
            const failedTests = util_1.isNullOrUndefined(failedTestsAggregation) ? 0 : failedTestsAggregation.count;
            totalTests = summary.aggregatedResultsAnalysis.totalTests;
            if (!includeOthersInTotal) {
                totalTests = passedTests + failedTests;
            }
        }
        return TestResultsHelper_1.TestResultsHelper.getTestOutcomePercentageString(passedTests, totalTests);
    }
}
exports.EmailReportViewModel = EmailReportViewModel;
//# sourceMappingURL=EmailReportViewModel.js.map