import { TestOutcomeForPriority } from "./TestOutcomeForPriority";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class TestSummaryItemModel {
    private name;
    private id;
    private totalTestCount;
    private testCountByOutcome;
    private testCountForOutcomeByPriority;
    private duration;
    constructor($name: string, $id: string);
    /**
     * Getter $name
     * @return {string}
     */
    get $name(): string;
    /**
     * Getter $id
     * @return {string}
     */
    get $id(): string;
    /**
     * Getter $totalTestCount
     * @return {number}
     */
    get $totalTestCount(): number;
    /**
     * Getter $testCountByOutcome
     * @return {Map<TestOutcome, number>}
     */
    get $testCountByOutcome(): Map<TestOutcome, number>;
    /**
     * Getter $testCountForOutcomeByPriority
     * @return {Map<TestOutcomeForPriority, number>}
     */
    get $testCountForOutcomeByPriority(): Map<number, Map<TestOutcomeForPriority, number>>;
    /**
     * Getter $duration
     * @return {any}
     */
    get $duration(): number;
    /**
     * Setter $totalTestCount
     * @param {number} value
     */
    set $totalTestCount(value: number);
    /**
     * Setter $duration
     * @param {any} value
     */
    set $duration(value: number);
    getFailedTestsCount(): number;
    getOtherTestsCount(): number;
    getPassedTestsCount(): number;
    private getTestOutcomeCount;
}
