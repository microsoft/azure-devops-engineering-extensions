import { AbstractTestResultsDetailsParser } from "./AbstractTestResultsDetailsParser";
import { TestResultsDetails } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultDetailsParserForRun } from "./TestResultDetailsParserForRun";
import { TestResultDetailsParserForPriority } from "./TestResultDetailsParserForPriority";
import { DataProviderError } from "../../exceptions/DataProviderError";

export class TestResultDetailsParserFactory {
  public static getParser(resultDetails: TestResultsDetails): AbstractTestResultsDetailsParser {
    var groupByField = resultDetails.groupByField;
    if (groupByField.toLowerCase() == "TestRun".toLowerCase()) {
      return new TestResultDetailsParserForRun(resultDetails);
    }

    if (groupByField.toLowerCase() == "Priority".toLowerCase()) {
      return new TestResultDetailsParserForPriority(resultDetails);
    }

    throw new DataProviderError(`TestResultsDetails by group ${groupByField} not supported`);
  }
}