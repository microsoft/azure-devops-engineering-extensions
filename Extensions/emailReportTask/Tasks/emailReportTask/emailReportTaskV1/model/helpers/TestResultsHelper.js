"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultsHelper = void 0;
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const TestOutcomeForPriority_1 = require("../testresults/TestOutcomeForPriority");
class TestResultsHelper {
    static getTestOutcomePercentage(testCountForOutcome, totalTests) {
        if (totalTests == 0) {
            console.log("Total Test count is 0. Setting outcome percentage to 0");
        }
        let testOutcomePercentage = totalTests == 0 ?
            0 :
            testCountForOutcome / totalTests * 100;
        return TestResultsHelper.getCustomizedDecimalValue(testOutcomePercentage);
    }
    static getCustomizedDecimalValue(value) {
        var fixedValue = Math.pow(10, TestResultsHelper.PercentagePrecision);
        return ((Math.floor(value * fixedValue)) / fixedValue);
    }
    static getTestOutcomePercentageString(testCountForOutcome, totalTests) {
        return this.getTestOutcomePercentage(testCountForOutcome, totalTests) + "%";
    }
    static getTotalTestCountBasedOnUserConfiguration(testCountsByOutcome, includeOthersInTotal) {
        var totalTests = 0;
        testCountsByOutcome.forEach((testCount, testOutcome) => {
            var isPassedTest = testOutcome == TestInterfaces_1.TestOutcome.Passed;
            var isFailedTest = testOutcome == TestInterfaces_1.TestOutcome.Failed;
            if (isPassedTest || isFailedTest || includeOthersInTotal) {
                totalTests += testCount;
            }
        });
        return totalTests;
    }
    static getTotalTestCountBasedOnUserConfigurationPriority(testCountsByOutcome, includeOthersInTotal) {
        var totalTests = 0;
        testCountsByOutcome.forEach((testCount, testOutcome) => {
            var isPassedTest = testOutcome == TestOutcomeForPriority_1.TestOutcomeForPriority.Passed;
            var isFailedTest = testOutcome == TestOutcomeForPriority_1.TestOutcomeForPriority.Failed;
            if (isPassedTest || isFailedTest || includeOthersInTotal) {
                totalTests += testCount;
            }
        });
        return totalTests;
    }
}
exports.TestResultsHelper = TestResultsHelper;
TestResultsHelper.PercentagePrecision = 2;
//# sourceMappingURL=TestResultsHelper.js.map