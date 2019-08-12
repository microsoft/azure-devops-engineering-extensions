import { TestSummaryGroupModel } from "../testresults/TestSummaryGroupModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestSummaryItemViewModel, TestSummaryItemViewModelWrapper } from "./TestSummaryItemViewModel";
import { TestResultSummaryViewModel } from "./TestResultSummaryViewModel";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";

export class TestSummaryGroupViewModelWrapper {
  public TestSummaryGroupViewModel: TestSummaryGroupViewModel[];
}

export class TestSummaryGroupViewModel {
  public GroupName: string;
  public SummaryItems: TestSummaryItemViewModelWrapper;
  private SupportedPriorityColumns: Set<number>;

  constructor(testSummaryGroup: TestSummaryGroupModel, 
    config: PipelineConfiguration,
    includeOthersInTotal: boolean)
  {
    this.GroupName = this.getDescription(testSummaryGroup.groupedBy);
    this.InitializeSummaryItems(testSummaryGroup, config, includeOthersInTotal);

    this.InitializeSupportedPriorityColumns();
  }

  private InitializeSummaryItems(
    testSummaryGroup: TestSummaryGroupModel, 
    config: PipelineConfiguration,
    includeOthersInTotal: boolean): void
  {
    this.SummaryItems = new TestSummaryItemViewModelWrapper();
    this.SummaryItems.TestSummaryItemViewModel = [];
    testSummaryGroup.runs.forEach(testSummaryItem => {
      this.SummaryItems.TestSummaryItemViewModel.push(new TestSummaryItemViewModel(testSummaryGroup.groupedBy, testSummaryItem, config, includeOthersInTotal));
    });
  }

  private InitializeSupportedPriorityColumns(): void {
    this.SupportedPriorityColumns = new Set<number>();

    this.SummaryItems.TestSummaryItemViewModel.forEach(item =>
      item.TestsByPriority.TestInfoByPriorityViewModel.forEach(testsByPriorityVm =>
      {
          if (testsByPriorityVm.Priority <= TestResultSummaryViewModel.MaxSupportedPriority)
          {
            this.SupportedPriorityColumns.add(testsByPriorityVm.Priority);
          }
      })
    );
  }

  private getDescription(groupedBy: GroupTestResultsBy): string {
    switch(groupedBy) {
      case GroupTestResultsBy.Priority: return "Priority";
      case GroupTestResultsBy.Run: return "Test Run";
      default: return "Team";
    }
  }
}