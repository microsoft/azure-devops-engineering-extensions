"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestOwnersDataProvider = void 0;
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
const ReportFactory_1 = require("../../model/ReportFactory");
class TestOwnersDataProvider {
    constructor(testResultsClient) {
        this.testResultsClient = testResultsClient;
    }
    getReportDataAsync(pipelineConfig, reportDataConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = ReportFactory_1.ReportFactory.createNewReport(pipelineConfig);
            const failedTestResultDetails = yield this.testResultsClient.getTestResultsDetailsAsync("TestRun", [TestInterfaces_1.TestOutcome.Failed]);
            const resultsToFetch = [];
            failedTestResultDetails.resultsForGroup.forEach(r => {
                resultsToFetch.push(...r.results);
            });
            const failedOwners = yield this.testResultsClient.getTestResultOwnersAsync(resultsToFetch);
            report.$failedTestOwners.push(...failedOwners);
            console.log("Fetched test owners data");
            return report;
        });
    }
}
exports.TestOwnersDataProvider = TestOwnersDataProvider;
//# sourceMappingURL=TestOwnersDataProvider.js.map