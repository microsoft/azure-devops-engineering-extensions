import { AbstractTestResultsDetailsParser } from "./AbstractTestResultsDetailsParser";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
import { TestResultsDetailsForGroup, TestResultsDetails } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TestResultDetailsParserForPriority extends AbstractTestResultsDetailsParser {
    constructor(testResultDetails: TestResultsDetails);
    getSummaryItems(): TestSummaryItemModel[];
    getGroupByValue(group: TestResultsDetailsForGroup): string;
    getTestResultsForRun(runId: number): Map<number, number>;
    private getPriority;
    private getTestCountByPriorityInTestRun;
}
