"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProviderFactory = void 0;
const PipelineType_1 = require("../config/pipeline/PipelineType");
const ReleaseDataProvider_1 = require("./pipeline/ReleaseDataProvider");
const ReleaseClient_1 = require("./restclients/ReleaseClient");
const TestOwnersDataProvider_1 = require("./tcmproviders/TestOwnersDataProvider");
const TestSummaryDataProvider_1 = require("./tcmproviders/TestSummaryDataProvider");
const TestResultsDataProvider_1 = require("./tcmproviders/TestResultsDataProvider");
const WorkItemClient_1 = require("./restclients/WorkItemClient");
const SendMailConditionProcessor_1 = require("./SendMailConditionProcessor");
const BuildClient_1 = require("./restclients/BuildClient");
const BuildDataProvider_1 = require("./pipeline/BuildDataProvider");
const BuildTestResultsClient_1 = require("./restclients/BuildTestResultsClient");
const ReleaseTestResultsClient_1 = require("./restclients/ReleaseTestResultsClient");
class DataProviderFactory {
    constructor($pipelineConfig) {
        this.dataProviders = [];
        this.postProcessors = [];
        this.pipelineConfig = $pipelineConfig;
    }
    getDataProviders() {
        if (this.dataProviders.length < 1) {
            if (this.pipelineConfig.$pipelineType == PipelineType_1.PipelineType.Release) {
                const pipelineRestClient = new ReleaseClient_1.ReleaseRestClient(this.pipelineConfig);
                this.dataProviders.push(new ReleaseDataProvider_1.ReleaseDataProvider(pipelineRestClient));
            }
            else {
                const pipelineRestClient = new BuildClient_1.BuildRestClient(this.pipelineConfig);
                this.dataProviders.push(new BuildDataProvider_1.BuildDataProvider(pipelineRestClient));
            }
            const testResultsClient = this.getTestResultsClient();
            const workItemClient = new WorkItemClient_1.WorkItemClient(this.pipelineConfig);
            this.dataProviders.push(new TestOwnersDataProvider_1.TestOwnersDataProvider(testResultsClient));
            this.dataProviders.push(new TestSummaryDataProvider_1.TestSummaryDataProvider(testResultsClient));
            this.dataProviders.push(new TestResultsDataProvider_1.TestResultsDataProvider(testResultsClient, workItemClient));
        }
        return this.dataProviders;
    }
    getPostProcessors() {
        if (this.postProcessors.length < 1) {
            this.postProcessors.push(new SendMailConditionProcessor_1.SendMailConditionProcessor(this.getTestResultsClient()));
        }
        return this.postProcessors;
    }
    getTestResultsClient() {
        if (this.testResultsClient == null) {
            this.testResultsClient = this.pipelineConfig.$pipelineType == PipelineType_1.PipelineType.Build ?
                new BuildTestResultsClient_1.BuildTestResultsClient(this.pipelineConfig) :
                new ReleaseTestResultsClient_1.ReleaseTestResultsClient(this.pipelineConfig);
        }
        return this.testResultsClient;
    }
}
exports.DataProviderFactory = DataProviderFactory;
//# sourceMappingURL=DataProviderFactory.js.map