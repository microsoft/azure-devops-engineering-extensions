import { TestResultModel } from "./TestResultModel";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";

export class TestResultsGroupModel
{
    public groupName : string;

    public testResults:  Map<TestOutcome, TestResultModel[]> = new Map<TestOutcome, TestResultModel[]>();
}