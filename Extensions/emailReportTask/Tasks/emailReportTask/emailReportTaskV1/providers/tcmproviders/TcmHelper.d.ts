import { TestOutcome, TestCaseResult, CustomTestField } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TcmHelper {
    static readonly OutcomeConfidenceValue: Number;
    static exceptOutcomes(outcomesToExclude: TestOutcome[]): TestOutcome[];
    static parseOutcome(outcomeString: string): TestOutcome;
    static isTestFlaky(result: TestCaseResult): boolean;
    static getCustomField(result: TestCaseResult, fieldName: string): CustomTestField;
    static Merge<T>(source: Array<Array<T>>): T[];
}
