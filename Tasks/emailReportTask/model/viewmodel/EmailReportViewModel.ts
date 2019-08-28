import { Report } from "../Report";
import { ReportConfiguration } from "../../config/ReportConfiguration";
import { isNullOrUndefined } from "util";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestOutcome, AggregatedResultsByOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { LinkHelper } from "../helpers/LinkHelper";
import { ReleaseViewModel } from "./ReleaseViewModel";
import { PhaseViewModel, PhaseViewModelWrapper } from "./PhaseViewModel";
import { PhaseIssuesViewModel } from "./PhaseIssuesViewModel";
import { TestResultSummaryViewModel } from "./TestResultSummaryViewModel";
import { TestResultsHelper } from "../helpers/TestResultsHelper";
import { ArtifactViewModelWrapper } from "./ArtifactViewModel";
import { ChangeViewModel, ChangeViewModelWrapper } from "./ChangeViewModel";
import { TestSummaryGroupViewModel, TestSummaryGroupViewModelWrapper } from "./TestSummaryGroupViewModel";
import { TestResultsGroupViewModel, TestResultsGroupViewModelWrapper } from "./TestResultsGroupViewModel";
import { PipelineType } from "../../config/pipeline/PipelineType";
import { BuildReferenceViewModel } from "./BuildReferenceViewModel";

export class EmailReportViewModel {

  public DataMissing: boolean;
  public HasFailedTests: boolean;
  public HasFilteredTests: boolean;
  public HasTaskFailures: boolean;
  public HasCanceledPhases: boolean;
  public MaxTestResultsToShow: number;
  public ProjectName: string;
  public Release: ReleaseViewModel;
  public Build: any;
  public Phases: PhaseViewModelWrapper;
  public PhaseIssuesSummary: PhaseIssuesViewModel;
  public AllTests: TestResultSummaryViewModel;
  public Artifacts: ArtifactViewModelWrapper;
  public AssociatedChanges: ChangeViewModelWrapper;
  public SummaryGroups: TestSummaryGroupViewModelWrapper;
  public TestResultsGroups: TestResultsGroupViewModelWrapper;
  public TestTabLink: string;
  public ShowAssociatedChanges: boolean;

  constructor(report: Report, reportConfiguration: ReportConfiguration) {
    this.ProjectName = reportConfiguration.$pipelineConfiguration.$projectName;
    this.HasTaskFailures = report.hasFailedTasks();

    if(reportConfiguration.$pipelineConfiguration.$pipelineType == PipelineType.Build) {
      this.Build = report.getPipelineViewModel(reportConfiguration.$pipelineConfiguration) as BuildReferenceViewModel;
    } else {
      this.Release = report.getPipelineViewModel(reportConfiguration.$pipelineConfiguration) as ReleaseViewModel;
    }

    this.Artifacts = new ArtifactViewModelWrapper();
    this.Artifacts.ArtifactViewModel = report.getArtifactViewModels(reportConfiguration.$pipelineConfiguration);

    this.HasCanceledPhases = report.hasCanceledPhases();
    this.InitializePhases(report);

    this.SetMailSubject(report, reportConfiguration);
    this.HasFailedTests = report.hasFailedTests(reportConfiguration.$reportDataConfiguration.$includeOthersInTotal);

    if (report.testResultSummary != null) {
      this.AllTests = new TestResultSummaryViewModel(null, report.testResultSummary, reportConfiguration.$pipelineConfiguration, reportConfiguration.$reportDataConfiguration.$includeOthersInTotal);
    }

    this.InitializeSummaryGroupViewModel(report, reportConfiguration);
    this.ShowAssociatedChanges = reportConfiguration.$reportDataConfiguration.$includeCommits;
    if (this.ShowAssociatedChanges) {
      this.InitializeAssociatedChanges(report, reportConfiguration.$pipelineConfiguration);
    }

    this.InitializeTestResultGroups(report, reportConfiguration);

    this.TestTabLink = LinkHelper.getTestTabLink(reportConfiguration.$pipelineConfiguration);
    this.DataMissing = report.$dataMissing;
  }

  private InitializePhases(report: Report): void {
    const phases: PhaseViewModel[] = [];
    if (isNullOrUndefined(report.$phases) || report.$phases.length < 1) {
      return;
    }

    report.$phases.forEach(phase => {
      phases.push(new PhaseViewModel(phase));
    });

    this.Phases = new PhaseViewModelWrapper();
    this.Phases.PhaseViewModel = phases;

    if (this.HasCanceledPhases) {
      this.PhaseIssuesSummary = new PhaseIssuesViewModel(report.$phases);
    }
  }

  private SetMailSubject(report: Report, reportConfig: ReportConfiguration): void {
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

  private InitializeAssociatedChanges(report: Report, pipelineConfig: PipelineConfiguration): void {
    if (!isNullOrUndefined(report.$associatedChanges) && report.$associatedChanges.length > 0) {
      this.AssociatedChanges = new ChangeViewModelWrapper();
      this.AssociatedChanges.ChangeViewModel = [];
      report.$associatedChanges.forEach(associatedChange => {
        this.AssociatedChanges.ChangeViewModel.push(new ChangeViewModel(associatedChange, pipelineConfig));
      });
    }
  }

  private InitializeSummaryGroupViewModel(report: Report, reportConfiguration: ReportConfiguration): void {
    this.SummaryGroups = new TestSummaryGroupViewModelWrapper();
    this.SummaryGroups.TestSummaryGroupViewModel = [];
    if (!isNullOrUndefined(report.$testSummaryGroups)) {
      report.$testSummaryGroups.forEach(summaryGroup => {
        reportConfiguration.$reportDataConfiguration.$groupTestSummaryBy.forEach(group => {
          if (summaryGroup.groupedBy == group) {
            console.log(`Creating summary group viewmodel for ${summaryGroup.groupedBy}`);
            this.SummaryGroups.TestSummaryGroupViewModel.push(new TestSummaryGroupViewModel(summaryGroup, reportConfiguration.$pipelineConfiguration, reportConfiguration.$reportDataConfiguration.$includeOthersInTotal));
          }
        });
      });
    }
  }

  private InitializeTestResultGroups(report: Report, reportConfig: ReportConfiguration): void {
    this.TestResultsGroups = new TestResultsGroupViewModelWrapper();
    this.TestResultsGroups.TestResultsGroupViewModel = [];

    if (report.filteredResults != null) {
      report.filteredResults.forEach(testResultGroupModel => {
        var testResultsGroupViewModel = new TestResultsGroupViewModel(testResultGroupModel, reportConfig);
        this.TestResultsGroups.TestResultsGroupViewModel.push(testResultsGroupViewModel);
      });
    }

    this.HasFilteredTests = report.hasFilteredTests;
  }

  private GetPassPercentage(report: Report, includeOthersInTotal: boolean): string {
    var summary = report.testResultSummary;
    let passedTests = 0, totalTests = 0;
    if (summary != null) {

      const passedTestsAggregation = report.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[TestOutcome.Passed];
      passedTests = isNullOrUndefined(passedTestsAggregation) ? 0 : passedTestsAggregation.count;

      const failedTestsAggregation = report.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome[TestOutcome.Failed];
      const failedTests = isNullOrUndefined(failedTestsAggregation) ? 0 : failedTestsAggregation.count;

      totalTests = summary.aggregatedResultsAnalysis.totalTests;

      if (!includeOthersInTotal) {
        totalTests = passedTests + failedTests;
      }
    }

    return TestResultsHelper.getTestOutcomePercentageString(passedTests, totalTests);
  }
}