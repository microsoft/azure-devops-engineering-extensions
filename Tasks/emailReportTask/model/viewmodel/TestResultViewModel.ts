import { WorkItemViewModel, WorkItemViewModelWrapper } from "./WorkItemViewModel";
import { TestResultModel } from "../testresults/TestResultModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { StringUtils } from "../../utils/StringUtils";
import { LinkHelper } from "../helpers/LinkHelper";
import { TimeFormatter } from "../helpers/TimeFormatter";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { DisplayNameHelper } from "../../utils/DisplayNameHelper";
import { ReleaseReferenceViewModel } from "./ReleaseReferenceViewModel";
import { PipelineType } from "../../config/pipeline/PipelineType";
import { BuildReferenceViewModel } from "./BuildReferenceViewModel";

export class TestResultViewModelWrapper {
  public TestResultViewModel: TestResultViewModel[];
}

export class TestResultViewModel {
  private readonly StackTraceLineCount = 5;
  public AssociatedBugs: WorkItemViewModelWrapper;
  public CreateBugLink: string;
  public Duration: string;
  public ErrorMessage: string;
  public FailingSinceBuild: any;
  public FailingSinceRelease: ReleaseReferenceViewModel;
  public FailingSinceTime: string;
  public Id: number;
  public Owner: string;
  public Priority: string;
  public StackTrace: string;
  public TestCaseTitle: string;
  public TestOutcome: string;
  public Url: string;

  constructor(testResultModel: TestResultModel, config: PipelineConfiguration) {
    const result = testResultModel.testResult;
    this.Id = result.id;
    this.TestCaseTitle = result.testCaseTitle;
    this.ErrorMessage = StringUtils.ReplaceNewlineWithBrTag(result.errorMessage);
    this.TestOutcome = result.outcome;
    this.StackTrace = StringUtils.ReplaceNewlineWithBrTag(
      StringUtils.getFirstNLines(result.stackTrace, this.StackTraceLineCount));

    if (result.priority != 255) {
      this.Priority = DisplayNameHelper.getPriorityDisplayName(result.priority == null ? "" : result.priority.toString());
    }

    this.InitializeAssociatedBugs(config, testResultModel.associatedBugs);

    this.Url = LinkHelper.getTestResultLink(config, result.testRun.id, this.Id);
    this.Owner = result.owner == null ? null : result.owner.displayName;

    if (result.failingSince != null) {
      const failingSincePipeline: any = config.$pipelineType == PipelineType.Build ? result.failingSince.release : result.failingSince.build;
      const failingSinceNotCurrent = failingSincePipeline == null ? false : failingSincePipeline.id != config.$pipelineId;

      if (failingSinceNotCurrent) {
        this.FailingSinceTime = result.failingSince.date.toDateString();

        if (result.failingSince.release != null && result.failingSince.release.id > 0) {
          this.FailingSinceRelease = new ReleaseReferenceViewModel(config, result.failingSince.release);
        }
        if (result.failingSince.build != null && result.failingSince.build.id > 0) {
          this.FailingSinceBuild = new BuildReferenceViewModel(config, null, result.failingSince.build);
        }
      }
    }

    this.Duration = TimeFormatter.FormatDuration(result.durationInMs);
    this.CreateBugLink = LinkHelper.getCreateBugLinkForTest(config, testResultModel.testResult);
  }

  private InitializeAssociatedBugs(config: PipelineConfiguration, associatedBugs: WorkItem[]): void {
    this.AssociatedBugs = new WorkItemViewModelWrapper();
    this.AssociatedBugs.WorkItemViewModel = [];
    if (associatedBugs == null) {
      return;
    }

    associatedBugs.forEach(workItem => {
      if (workItem.id != null) {
        this.AssociatedBugs.WorkItemViewModel.push(new WorkItemViewModel(config, workItem));
      }
    });
  }
}