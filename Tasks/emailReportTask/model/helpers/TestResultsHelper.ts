import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestOutcomeForPriority } from "../testresults/TestOutcomeForPriority";

export class TestResultsHelper {
    public static readonly PercentagePrecision = 2;

    public static getTestOutcomePercentage(testCountForOutcome: number, totalTests: number): number {
        if (totalTests == 0)
        {
            console.log("Total Test count is 0. Setting outcome percentage to 0");
        }

        let testOutcomePercentage = totalTests == 0 ?
            0 : 
            testCountForOutcome / totalTests * 100;

        return TestResultsHelper.getCustomizedDecimalValue(testOutcomePercentage);
    }

    private static getCustomizedDecimalValue(value: number): number  {
        var fixedValue = Math.pow(10, TestResultsHelper.PercentagePrecision);
        return ((Math.floor(value * fixedValue)) / fixedValue);
    }

    public static getTestOutcomePercentageString(testCountForOutcome: number, totalTests: number): string  {
        return this.getTestOutcomePercentage(testCountForOutcome, totalTests) + "%";
    }

    public static getTotalTestCountBasedOnUserConfiguration(
      testCountsByOutcome: Map<TestOutcome, number>,
      includeOthersInTotal: boolean): number {
        var totalTests = 0;

        testCountsByOutcome.forEach( (testCount: number, testOutcome: TestOutcome) => {
            var isPassedTest = testOutcome == TestOutcome.Passed;
            var isFailedTest = testOutcome == TestOutcome.Failed;

            if (isPassedTest || isFailedTest || includeOthersInTotal)
            {
                totalTests += testCount;
            }
        });

        return totalTests;
    }

    public static getTotalTestCountBasedOnUserConfigurationPriority(
        testCountsByOutcome: Map<TestOutcomeForPriority, number>, 
        includeOthersInTotal: boolean): number
    {
        var totalTests = 0;

        testCountsByOutcome.forEach( (testCount: number, testOutcome: TestOutcomeForPriority) => {
            var isPassedTest = testOutcome == TestOutcomeForPriority.Passed;
            var isFailedTest = testOutcome == TestOutcomeForPriority.Failed;

            if (isPassedTest || isFailedTest || includeOthersInTotal)
            {
                totalTests += testCount;
            }
        });

        return totalTests;
    }
}