import { AbstractTestResultsDetailsParser } from "./AbstractTestResultsDetailsParser";
import { TestResultsDetails } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TestResultDetailsParserFactory {
    static getParser(resultDetails: TestResultsDetails): AbstractTestResultsDetailsParser;
}
