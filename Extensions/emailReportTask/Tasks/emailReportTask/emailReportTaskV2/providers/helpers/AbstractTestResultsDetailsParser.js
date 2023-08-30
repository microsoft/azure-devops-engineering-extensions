"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTestResultsDetailsParser = void 0;
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const util_1 = require("util");
const TimeFormatter_1 = require("../../model/helpers/TimeFormatter");
class AbstractTestResultsDetailsParser {
    constructor(testResultDetails) {
        this.testResultDetails = testResultDetails;
    }
    /// <summary>
    /// Get Duration, TotalTests & test count by outcome
    /// Calculating total duration, as the tcm data has duration by test outcome only.
    /// </summary>
    parseBaseData(resultsForGroup, summaryItem) {
        let duration = 0;
        for (let item in TestInterfaces_1.TestOutcome) {
            if (!isNaN(Number(item))) {
                const resultsByOutCome = resultsForGroup.resultsCountByOutcome[Number(item)];
                if (!util_1.isNullOrUndefined(resultsByOutCome)) {
                    summaryItem.$testCountByOutcome.set(resultsByOutCome.outcome, resultsByOutCome.count);
                    duration += TimeFormatter_1.TimeFormatter.ConvertTimeStringToMilliSeconds(resultsByOutCome.duration);
                }
            }
        }
        // // HACK - SHould get data directly from resultsGroup.resultsCountByOutcome - but that data is coming wrong
        // resultsForGroup.results.forEach(r => {
        //   duration += isNaN(r.durationInMs) ? 0 : r.durationInMs;
        // });
        summaryItem.$duration = duration;
        summaryItem.$totalTestCount = resultsForGroup.results.length;
    }
}
exports.AbstractTestResultsDetailsParser = AbstractTestResultsDetailsParser;
//# sourceMappingURL=AbstractTestResultsDetailsParser.js.map