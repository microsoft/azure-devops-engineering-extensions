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
exports.TestResultsQueryImpl = exports.AbstractTestResultsClient = void 0;
const AbstractClient_1 = require("./AbstractClient");
const RetryablePromise_1 = require("./RetryablePromise");
class AbstractTestResultsClient extends AbstractClient_1.AbstractClient {
    constructor(pipelineConfig) {
        super(pipelineConfig);
        this.MaxItemsSupported = 100;
        this.testApiPromise = this.connection.getTestApi();
    }
    queryTestResultBugs(automatedTestName, resultId) {
        return __awaiter(this, void 0, void 0, function* () {
            const testApi = yield this.testApiPromise;
            return yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () {
                return testApi.queryTestResultWorkItems(this.pipelineConfig.$projectName, "Microsoft.BugCategory", automatedTestName, resultId);
            }), "QueryTestResultBugs");
        });
    }
    getTestResultById(testRunId, resultId) {
        return __awaiter(this, void 0, void 0, function* () {
            const testApi = yield this.testApiPromise;
            return yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return testApi.getTestResultById(this.pipelineConfig.$projectName, testRunId, resultId); }), "GetTestResultById");
        });
    }
    queryTestResultsReportAsync(parameterConfig = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = parameterConfig != null ? parameterConfig : this.pipelineConfig;
            return yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.queryTestResultsReportForPipelineAsync(config); }), "QueryTestResultsReport");
        });
    }
    getTestResultOwnersAsync(resultsToFetch) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = new TestResultsQueryImpl();
            query.fields = ["Owner"];
            const results = [];
            const testApi = yield this.testApiPromise;
            for (let i = 0, j = resultsToFetch.length; i < j; i += this.MaxItemsSupported) {
                const tempArray = resultsToFetch.slice(i, i + this.MaxItemsSupported);
                query.results = tempArray;
                let queryResult = yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return testApi.getTestResultsByQuery(query, this.pipelineConfig.$projectName); }), "GetTestResultOwners");
                results.push(...queryResult.results);
            }
            const ownerMap = new Map();
            results.forEach(r => {
                if (this.isValid(r.owner)) {
                    const key = this.getUniqueName(r.owner);
                    if (!ownerMap.has(key)) {
                        ownerMap.set(key, r.owner);
                    }
                }
            });
            const identities = [];
            ownerMap.forEach((value, key) => identities.push(value));
            return identities;
        });
    }
    getTestResultsDetailsAsync(groupBy, outcomeFilters, parameterConfig = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = this.getOutcomeFilter(outcomeFilters);
            const config = parameterConfig != null ? parameterConfig : this.pipelineConfig;
            return yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.getTestResultsDetailsForPipelineAsync(config, groupBy, filter); }), "GetTestResultsDetails");
        });
    }
    getTestResultSummaryAsync(includeFailures, parameterConfig = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = parameterConfig != null ? parameterConfig : this.pipelineConfig;
            return yield RetryablePromise_1.RetryablePromise.RetryAsync(() => __awaiter(this, void 0, void 0, function* () { return this.queryTestResultsReportForPipelineAsync(config, includeFailures); }), "GetTestResultSummary");
        });
    }
    getTestResultsByQueryAsync(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.testApiPromise).getTestResultsByQuery(query, this.pipelineConfig.$projectId);
        });
    }
    getOutcomeFilter(outcomes) {
        let filter = null;
        if (outcomes != null && outcomes.length > 0) {
            const outComeString = Array.from(new Set(outcomes.map(o => Number(o)))).join(",");
            filter = `Outcome eq ${outComeString}`;
        }
        return filter;
    }
    getUniqueName(identity) {
        return identity.uniqueName == null ? identity.displayName : identity.uniqueName;
    }
    isValid(identity) {
        return identity != null && (identity.displayName != null || identity.uniqueName != null);
    }
}
exports.AbstractTestResultsClient = AbstractTestResultsClient;
class TestResultsQueryImpl {
}
exports.TestResultsQueryImpl = TestResultsQueryImpl;
//# sourceMappingURL=AbstractTestResultsClient.js.map