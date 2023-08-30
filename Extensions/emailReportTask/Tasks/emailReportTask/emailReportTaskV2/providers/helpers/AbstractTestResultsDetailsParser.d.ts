import { TestResultsDetails, TestResultsDetailsForGroup } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
export declare abstract class AbstractTestResultsDetailsParser {
    protected testResultDetails: TestResultsDetails;
    constructor(testResultDetails: TestResultsDetails);
    abstract getSummaryItems(): Array<TestSummaryItemModel>;
    abstract getGroupByValue(group: TestResultsDetailsForGroup): string;
    protected parseBaseData(resultsForGroup: TestResultsDetailsForGroup, summaryItem: TestSummaryItemModel): void;
}
