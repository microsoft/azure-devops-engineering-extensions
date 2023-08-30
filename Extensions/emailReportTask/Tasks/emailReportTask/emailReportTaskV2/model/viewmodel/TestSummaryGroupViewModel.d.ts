import { TestSummaryGroupModel } from "../testresults/TestSummaryGroupModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestSummaryItemViewModelWrapper } from "./TestSummaryItemViewModel";
export declare class TestSummaryGroupViewModelWrapper {
    TestSummaryGroupViewModel: TestSummaryGroupViewModel[];
}
export declare class TestSummaryGroupViewModel {
    GroupName: string;
    SummaryItems: TestSummaryItemViewModelWrapper;
    private SupportedPriorityColumns;
    constructor(testSummaryGroup: TestSummaryGroupModel, config: PipelineConfiguration, includeOthersInTotal: boolean);
    private InitializeSummaryItems;
    private InitializeSupportedPriorityColumns;
    private getDescription;
}
