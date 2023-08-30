import { TestSummaryItemModel } from "../testresults/TestSummaryItemModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestResultSummary } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TestResultSummaryViewModel {
    static readonly MaxSupportedPriority = 2;
    Duration: string;
    FailedTests: number;
    OtherTests: number;
    PassedTests: number;
    PassingRate: string;
    TotalTests: number;
    Url: string;
    constructor(summaryItemModel: TestSummaryItemModel, summary: TestResultSummary, pipelineConfiguration: PipelineConfiguration, includeOthersInTotal: boolean);
}
