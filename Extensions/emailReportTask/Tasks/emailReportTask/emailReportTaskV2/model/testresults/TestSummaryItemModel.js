"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSummaryItemModel = void 0;
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
class TestSummaryItemModel {
    constructor($name, $id) {
        this.name = $name;
        this.id = $id;
        this.testCountByOutcome = new Map();
        this.testCountForOutcomeByPriority = new Map();
    }
    /**
     * Getter $name
     * @return {string}
     */
    get $name() {
        return this.name;
    }
    /**
     * Getter $id
     * @return {string}
     */
    get $id() {
        return this.id;
    }
    /**
     * Getter $totalTestCount
     * @return {number}
     */
    get $totalTestCount() {
        return this.totalTestCount;
    }
    /**
     * Getter $testCountByOutcome
     * @return {Map<TestOutcome, number>}
     */
    get $testCountByOutcome() {
        return this.testCountByOutcome;
    }
    /**
     * Getter $testCountForOutcomeByPriority
     * @return {Map<TestOutcomeForPriority, number>}
     */
    get $testCountForOutcomeByPriority() {
        return this.testCountForOutcomeByPriority;
    }
    /**
     * Getter $duration
     * @return {any}
     */
    get $duration() {
        return this.duration;
    }
    /**
     * Setter $totalTestCount
     * @param {number} value
     */
    set $totalTestCount(value) {
        this.totalTestCount = value;
    }
    /**
     * Setter $duration
     * @param {any} value
     */
    set $duration(value) {
        this.duration = value;
    }
    getFailedTestsCount() {
        return this.getTestOutcomeCount(TestInterfaces_1.TestOutcome.Failed);
    }
    getOtherTestsCount() {
        let totalCount = 0;
        this.testCountByOutcome.forEach((value, key) => {
            if (key != TestInterfaces_1.TestOutcome.Passed && key != TestInterfaces_1.TestOutcome.Failed) {
                totalCount += value;
            }
        });
        return totalCount;
    }
    getPassedTestsCount() {
        return this.getTestOutcomeCount(TestInterfaces_1.TestOutcome.Passed);
    }
    getTestOutcomeCount(testOutcome) {
        if (this.testCountByOutcome.has(testOutcome)) {
            return this.testCountByOutcome.get(testOutcome);
        }
        return 0;
    }
}
exports.TestSummaryItemModel = TestSummaryItemModel;
//# sourceMappingURL=TestSummaryItemModel.js.map