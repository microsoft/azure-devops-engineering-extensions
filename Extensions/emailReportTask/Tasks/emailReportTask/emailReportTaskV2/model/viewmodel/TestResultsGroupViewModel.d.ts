import { TestResultViewModelWrapper } from "./TestResultViewModel";
import { ReportConfiguration } from "../../config/ReportConfiguration";
import { TestResultsGroupModel } from "../testresults/TestResultGroupModel";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultModel } from "../testresults/TestResultModel";
export declare class TestResultsGroupViewModelWrapper {
    TestResultsGroupViewModel: TestResultsGroupViewModel[];
}
export declare class TestResultsGroupViewModel {
    FailedTests: TestResultViewModelWrapper;
    GroupName: string;
    OtherTests: TestResultViewModelWrapper;
    PassedTests: TestResultViewModelWrapper;
    constructor(resultsGroupModel: TestResultsGroupModel, reportConfig: ReportConfiguration);
    private setGroupName;
    private getTestResultViewModels;
    getTestResultsByOutcomes(source: TestResultsGroupModel, outcomes: TestOutcome[]): TestResultModel[];
}
