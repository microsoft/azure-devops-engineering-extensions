import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestOutcomeForPriority } from "../testresults/TestOutcomeForPriority";
export declare class TestResultsHelper {
    static readonly PercentagePrecision = 2;
    static getTestOutcomePercentage(testCountForOutcome: number, totalTests: number): number;
    private static getCustomizedDecimalValue;
    static getTestOutcomePercentageString(testCountForOutcome: number, totalTests: number): string;
    static getTotalTestCountBasedOnUserConfiguration(testCountsByOutcome: Map<TestOutcome, number>, includeOthersInTotal: boolean): number;
    static getTotalTestCountBasedOnUserConfigurationPriority(testCountsByOutcome: Map<TestOutcomeForPriority, number>, includeOthersInTotal: boolean): number;
}
