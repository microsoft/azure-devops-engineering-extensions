import { WorkItemViewModelWrapper } from "./WorkItemViewModel";
import { TestResultModel } from "../testresults/TestResultModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ReleaseReferenceViewModel } from "./ReleaseReferenceViewModel";
export declare class TestResultViewModelWrapper {
    TestResultViewModel: TestResultViewModel[];
}
export declare class TestResultViewModel {
    private readonly StackTraceLineCount;
    AssociatedBugs: WorkItemViewModelWrapper;
    CreateBugLink: string;
    Duration: string;
    ErrorMessage: string;
    FailingSinceBuild: any;
    FailingSinceRelease: ReleaseReferenceViewModel;
    FailingSinceTime: string;
    Id: number;
    Owner: string;
    Priority: string;
    StackTrace: string;
    TestCaseTitle: string;
    TestOutcome: string;
    Url: string;
    constructor(testResultModel: TestResultModel, config: PipelineConfiguration);
    private InitializeAssociatedBugs;
}
