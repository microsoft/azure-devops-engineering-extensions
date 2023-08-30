import { TestResultModel } from "./TestResultModel";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TestResultsGroupModel {
    groupName: string;
    testResults: Map<TestOutcome, TestResultModel[]>;
}
