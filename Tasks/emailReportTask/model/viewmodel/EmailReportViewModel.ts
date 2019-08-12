import { Report } from "../Report";
import { ReportConfiguration } from "../../config/ReportConfiguration";
import { isNullOrUndefined } from "util";
import { StringUtils } from "../../utils/StringUtils";
import { ReportError } from "../../exceptions/ReportError";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestOutcome, AggregatedResultsByOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { LinkHelper } from "../helpers/LinkHelper";
import { ReleaseViewModel } from "./ReleaseViewModel";
import { PhaseViewModel, PhaseViewModelWrapper } from "./PhaseViewModel";
import { PhaseIssuesViewModel } from "./PhaseIssuesViewModel";
import { TestResultSummaryViewModel } from "./TestResultSummaryViewModel";
import { TestResultsHelper } from "../helpers/TestResultsHelper";
import { ArtifactViewModel, ArtifactViewModelWrapper } from "./ArtifactViewModel";
import { ChangeViewModel, ChangeViewModelWrapper } from "./ChangeViewModel";
import { TestSummaryGroupViewModel, TestSummaryGroupViewModelWrapper } from "./TestSummaryGroupViewModel";
import { TestResultsGroupViewModel, TestResultsGroupViewModelWrapper } from "./TestResultsGroupViewModel";

export class EmailReportViewModel {

  public DataMissing: boolean;
  public EmailSubject: string;
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
    this.Release = report.getReleaseViewModel(reportConfiguration.$pipelineConfiguration);
    //this.Build = emailReportDto.GetBuildViewModel(config);
    this.Artifacts = new ArtifactViewModelWrapper();
    this.Artifacts.ArtifactViewModel = report.getArtifactViewModels(reportConfiguration.$pipelineConfiguration);

    this.HasCanceledPhases = report.hasCanceledPhases();
    this.InitializePhases(report);

    this.EmailSubject = this.GetMailSubject(report, reportConfiguration);
    this.HasFailedTests = report.hasFailedTests(reportConfiguration.$reportDataConfiguration.$includeOthersInTotal);

     //const summaryGroupModel = isNullOrUndefined(report.$testSummaryGroups) || report.$testSummaryGroups.length < 1 ? null : report.$testSummaryGroups[0];

    if (report.testResultSummary != null)
    {
      this.AllTests = new TestResultSummaryViewModel(null, report.testResultSummary, reportConfiguration.$pipelineConfiguration, reportConfiguration.$reportDataConfiguration.$includeOthersInTotal);
    }

    this.InitializeSummaryGroupViewModel(report, reportConfiguration);
    this.ShowAssociatedChanges = reportConfiguration.$reportDataConfiguration.$includeCommits;
    if (this.ShowAssociatedChanges)
    {
        this.InitializeAssociatedChanges(report, reportConfiguration.$pipelineConfiguration);
    }

    this.InitializeTestResultGroups(report, reportConfiguration);

    this.TestTabLink = LinkHelper.getTestTabLink(reportConfiguration.$pipelineConfiguration);      
    this.DataMissing = report.$dataMissing;
  }

  private InitializePhases(report: Report): void
  {
      const phases: PhaseViewModel[] = [];
      if (isNullOrUndefined(report.$phases) || report.$phases.length < 1)
      {
          return;
      }
  
      report.$phases.forEach(phase => {
        phases.push(new PhaseViewModel(phase));
      });

      this.Phases = new PhaseViewModelWrapper();
      this.Phases.PhaseViewModel = phases;
  
      if (this.HasCanceledPhases)
      {
          this.PhaseIssuesSummary = new PhaseIssuesViewModel(report.$phases);
      }
  }

  private GetMailSubject(report: Report, reportConfig: ReportConfiguration): string {
    var userDefinedSubject = reportConfig.$mailConfiguration.$mailSubject;

    if (StringUtils.isNullOrWhiteSpace(userDefinedSubject))
    {
      throw new ReportError("Email subject not set");
    }

    let subject: string;

    if (userDefinedSubject.includes("{passPercentage}"))
    {
      var passPercentage = this.GetPassPercentage(report, reportConfig.$reportDataConfiguration.$includeOthersInTotal);
      subject = userDefinedSubject.replace("{passPercentage}", passPercentage);
    }
    else
    {
      subject = userDefinedSubject;
    }

    if (userDefinedSubject.includes("{environmentStatus}"))
    {
      subject = userDefinedSubject.replace("{environmentStatus}", report.getEnvironmentStatus());
    }
    return subject;
}

  private InitializeAssociatedChanges(report: Report, pipelineConfig: PipelineConfiguration): void {
    if (!isNullOrUndefined(report.$associatedChanges) && report.$associatedChanges.length > 0)
    {
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
            if(summaryGroup.groupedBy == group) {
              console.log(`Creating summary group viewmodel for ${summaryGroup.groupedBy}`);
              this.SummaryGroups.TestSummaryGroupViewModel.push(new TestSummaryGroupViewModel(summaryGroup, reportConfiguration.$pipelineConfiguration, reportConfiguration.$reportDataConfiguration.$includeOthersInTotal));
            }
          });
        });
    }
  }  

  private InitializeTestResultGroups(report: Report, reportConfig: ReportConfiguration): void {
    this.TestResultsGroups= new TestResultsGroupViewModelWrapper();
    this.TestResultsGroups.TestResultsGroupViewModel = [];

    if (report.filteredResults != null)
    {
       report.filteredResults.forEach(testResultGroupModel => {
        var testResultsGroupViewModel = new TestResultsGroupViewModel(testResultGroupModel, reportConfig);
        this.TestResultsGroups.TestResultsGroupViewModel.push(testResultsGroupViewModel);
      });
    }

    this.HasFilteredTests = report.hasFilteredTests;
  }

  private GetPassPercentage(report: Report, includeOthersInTotal: boolean): string {
    var summary = report.testResultSummary;
    var totalTests = 0;
    var passedTests = 0;
    var failedTests = 0;

    if (summary != null)
    {
      const resultsByOutcomeFalse: AggregatedResultsByOutcome = (summary.aggregatedResultsAnalysis.resultsByOutcome as any).false;
      const resultsByOutcomeTrue: AggregatedResultsByOutcome = (summary.aggregatedResultsAnalysis.resultsByOutcome as any).true;
      if (!isNullOrUndefined(resultsByOutcomeFalse) && resultsByOutcomeFalse.outcome == TestOutcome.Passed)
      {
          passedTests += resultsByOutcomeFalse.count;
      }

      if (!isNullOrUndefined(resultsByOutcomeTrue) && resultsByOutcomeFalse.outcome == TestOutcome.Passed)
      {
          passedTests += resultsByOutcomeFalse.count;
      }

      if (!isNullOrUndefined(resultsByOutcomeFalse) && resultsByOutcomeFalse.outcome == TestOutcome.Failed)
      {
        failedTests += resultsByOutcomeFalse.count;
      }

      if (!isNullOrUndefined(resultsByOutcomeTrue) && resultsByOutcomeTrue.outcome == TestOutcome.Failed)
      {
        failedTests += resultsByOutcomeTrue.count;
      }

      totalTests = summary.aggregatedResultsAnalysis.totalTests;

      if(!includeOthersInTotal)
      {
        totalTests = passedTests + failedTests;
      }
    }

    return TestResultsHelper.getTestOutcomePercentageString(passedTests, totalTests);
  }
}