"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultDetailsParserFactory = void 0;
const TestResultDetailsParserForRun_1 = require("./TestResultDetailsParserForRun");
const TestResultDetailsParserForPriority_1 = require("./TestResultDetailsParserForPriority");
const DataProviderError_1 = require("../../exceptions/DataProviderError");
class TestResultDetailsParserFactory {
    static getParser(resultDetails) {
        var groupByField = resultDetails.groupByField;
        if (groupByField.toLowerCase() == "TestRun".toLowerCase()) {
            return new TestResultDetailsParserForRun_1.TestResultDetailsParserForRun(resultDetails);
        }
        if (groupByField.toLowerCase() == "Priority".toLowerCase()) {
            return new TestResultDetailsParserForPriority_1.TestResultDetailsParserForPriority(resultDetails);
        }
        throw new DataProviderError_1.DataProviderError(`TestResultsDetails by group ${groupByField} not supported`);
    }
}
exports.TestResultDetailsParserFactory = TestResultDetailsParserFactory;
//# sourceMappingURL=TestResultDetailsParserFactory.js.map