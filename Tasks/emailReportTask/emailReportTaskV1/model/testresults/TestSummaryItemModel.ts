import { TestOutcomeForPriority } from "./TestOutcomeForPriority";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";

export class TestSummaryItemModel {
  private name: string;
  private id: string;
  private totalTestCount: number;
  private testCountByOutcome: Map<TestOutcome, number>;
  private testCountForOutcomeByPriority: Map<number, Map<TestOutcomeForPriority, number>>;
  private duration: number;

  constructor($name: string, $id: string) {
    this.name = $name;
    this.id = $id;
    this.testCountByOutcome = new Map<TestOutcome, number>();
    this.testCountForOutcomeByPriority = new Map<number, Map<TestOutcomeForPriority, number>>();
  }

  /**
   * Getter $name
   * @return {string}
   */
  public get $name(): string {
    return this.name;
  }

  /**
   * Getter $id
   * @return {string}
   */
  public get $id(): string {
    return this.id;
  }

  /**
   * Getter $totalTestCount
   * @return {number}
   */
  public get $totalTestCount(): number {
    return this.totalTestCount;
  }

  /**
   * Getter $testCountByOutcome
   * @return {Map<TestOutcome, number>}
   */
  public get $testCountByOutcome(): Map<TestOutcome, number> {
    return this.testCountByOutcome;
  }

  /**
   * Getter $testCountForOutcomeByPriority
   * @return {Map<TestOutcomeForPriority, number>}
   */
  public get $testCountForOutcomeByPriority(): Map<number, Map<TestOutcomeForPriority, number>> {
    return this.testCountForOutcomeByPriority;
  }

  /**
   * Getter $duration
   * @return {any}
   */
  public get $duration(): number {
    return this.duration;
  }


  /**
   * Setter $totalTestCount
   * @param {number} value
   */
  public set $totalTestCount(value: number) {
    this.totalTestCount = value;
  }

  /**
   * Setter $duration
   * @param {any} value
   */
  public set $duration(value: number) {
    this.duration = value;
  }

  public getFailedTestsCount(): number {
    return this.getTestOutcomeCount(TestOutcome.Failed);
  }

  public getOtherTestsCount(): number {
    let totalCount = 0;
    this.testCountByOutcome.forEach((value: number, key: TestOutcome) => {
      if (key != TestOutcome.Passed && key != TestOutcome.Failed) {
        totalCount += value;
      }
    });
    return totalCount;
  }

  public getPassedTestsCount(): number {
    return this.getTestOutcomeCount(TestOutcome.Passed);
  }

  private getTestOutcomeCount(testOutcome: TestOutcome): number {
    if (this.testCountByOutcome.has(testOutcome)) {
      return this.testCountByOutcome.get(testOutcome);
    }
    return 0;
  }
}