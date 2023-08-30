import { AbstractTestResultsDetailsParser } from "./AbstractTestResultsDetailsParser";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
import { TestResultsDetailsForGroup, TestResultsDetails } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TestResultDetailsParserForRun extends AbstractTestResultsDetailsParser {
    constructor(testResultDetails: TestResultsDetails);
    getSummaryItems(): TestSummaryItemModel[];
    getGroupByValue(group: TestResultsDetailsForGroup): string;
    private getTestRunSummaryInfo;
    private readGroupByValue;
}
export declare class TestRunInfo {
    id: number;
    name: string;
}
