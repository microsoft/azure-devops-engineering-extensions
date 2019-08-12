import { TestResultSummaryViewModel } from "./TestResultSummaryViewModel";
import { TestInfoByPriorityViewModel, TestInfoByPriorityViewModelWrapper } from "./TestInfoByPriorityViewModel";
import { TestSummaryItemModel } from "../testresults/TestSummaryItemModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { TestOutcomeForPriority } from "../testresults/TestOutcomeForPriority";

export class TestSummaryItemViewModelWrapper {
  public TestSummaryItemViewModel: TestSummaryItemViewModel[];
}

export class TestSummaryItemViewModel extends TestResultSummaryViewModel {
  public Name: string;
  public TestsByPriority: TestInfoByPriorityViewModelWrapper = new TestInfoByPriorityViewModelWrapper();

  constructor(
    groupedBy: GroupTestResultsBy,
    summaryItem: TestSummaryItemModel,
    config: PipelineConfiguration,
    includeOthersInTotal: boolean) {
    super(summaryItem, null, config, includeOthersInTotal);
    this.Name = (groupedBy == GroupTestResultsBy.Priority) ?
      this.getDisplayName(summaryItem.$name) :
      summaryItem.$name;

    this.setupPriorityData(summaryItem, includeOthersInTotal);
  }

  private setupPriorityData(summaryItem: TestSummaryItemModel, includeOthersInTotal: boolean): void {
    this.TestsByPriority.TestInfoByPriorityViewModel = [];

    const testCountForOutcomeByPriority: Map<number, Map<TestOutcomeForPriority, number>> =
      summaryItem.$testCountForOutcomeByPriority;

    testCountForOutcomeByPriority.forEach((value: Map<TestOutcomeForPriority, number>, priority: number) => {
      if (priority <= TestResultSummaryViewModel.MaxSupportedPriority) {
        this.TestsByPriority.TestInfoByPriorityViewModel.push(new TestInfoByPriorityViewModel(priority, value, includeOthersInTotal));
      }
    });
  }

  public getDisplayName(priority: string): string {
    const priorityInt = Number.parseInt(priority);
    if (!isNaN(priorityInt) && priorityInt == 255) {
      return "Priority unspecified";
    }
    return `Priority: ${priority}`;
  }
} 