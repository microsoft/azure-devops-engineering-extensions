import { TestResultSummaryViewModel } from "./TestResultSummaryViewModel";
import { TestInfoByPriorityViewModelWrapper } from "./TestInfoByPriorityViewModel";
import { TestSummaryItemModel } from "../testresults/TestSummaryItemModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
export declare class TestSummaryItemViewModelWrapper {
    TestSummaryItemViewModel: TestSummaryItemViewModel[];
}
export declare class TestSummaryItemViewModel extends TestResultSummaryViewModel {
    Name: string;
    TestsByPriority: TestInfoByPriorityViewModelWrapper;
    constructor(groupedBy: GroupTestResultsBy, summaryItem: TestSummaryItemModel, config: PipelineConfiguration, includeOthersInTotal: boolean);
    private setupPriorityData;
    getDisplayName(priority: string): string;
}
