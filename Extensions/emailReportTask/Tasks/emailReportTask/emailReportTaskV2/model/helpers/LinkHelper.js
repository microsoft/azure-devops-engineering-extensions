"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkHelper = void 0;
const PipelineType_1 = require("../../config/pipeline/PipelineType");
class LinkHelper {
    static getBuildDefinitionLinkById(definitionId, config) {
        var collectionUri = config.$teamUri;
        var parameters = new Map();
        parameters.set("definitionId", definitionId.toString());
        parameters.set("_a", "summary");
        var uri = this.getBuildLink(config, collectionUri, parameters);
        return uri;
    }
    static getBuildLink(config, collectionUri, parameters) {
        return collectionUri + "/" + this.getBuildRelativeUrl(config.$projectName) + "/results" + this.getQueryParameter(parameters);
    }
    static getCommitLink(changeId, changeUri, config) {
        var collectionUri = config.$teamUri;
        let repoId = null;
        var pos = changeUri.indexOf("repositories");
        if (pos > 0) {
            repoId = changeUri.substr(pos).split("/")[1];
        }
        var uri = collectionUri + `/${config.$projectName}/_git/${repoId}/commit/${changeId})`;
        return uri;
    }
    static getCreateBugLinkForTest(config, testResult) {
        const testRunId = testResult.testRun == null ? null : testResult.testRun.id;
        const parameters = new Map();
        parameters.set("create-bug", "true");
        return LinkHelper.getTestResultLink(config, testRunId, testResult.id, parameters);
    }
    static getQueryParameter(parameterValues) {
        var queryString = "";
        parameterValues.forEach((value, key) => {
            queryString = (queryString == "")
                ? "?" + key + "=" + value
                : queryString + "&" + key + "=" + value;
        });
        return queryString;
    }
    static getReleaseDefinitionLink(config, releaseDefinitionId) {
        var collectionUri = config.$teamUri;
        const parameters = new Map();
        parameters.set("definitionId", releaseDefinitionId.toString());
        parameters.set("_a", "environments-editor");
        return collectionUri + "/" + config.$projectName + "/" + LinkHelper.ReleaseDefView + "/" + LinkHelper.getQueryParameter(parameters);
    }
    static getReleaseLogsTabLink(config) {
        var collectionUri = config.$teamUri;
        const queryParams = new Map();
        queryParams.set("releaseId", config.$pipelineId.toString());
        queryParams.set("_a", LinkHelper.ReleaseEnvironmentLogsExtension);
        queryParams.set("environmentId", config.$environmentId.toString());
        return collectionUri + "/" + config.$projectName + "/" + LinkHelper.ReleaseProgressView + LinkHelper.getQueryParameter(queryParams);
    }
    static getReleaseSummaryLink(config) {
        var collectionUri = config.$teamUri;
        const queryParams = new Map();
        queryParams.set("releaseId", config.$pipelineId.toString());
        return collectionUri + "/" + config.$projectName + "/" + LinkHelper.ReleaseProgressView + LinkHelper.getQueryParameter(queryParams);
    }
    static getTestResultLink(config, runId, resultId, queryParams) {
        var collectionUri = config.$teamUri;
        const parameters = new Map();
        parameters.set("runId", runId);
        parameters.set("_a", "resultSummary");
        parameters.set("resultId", resultId.toString());
        if (queryParams != null) {
            queryParams.forEach((value, key) => {
                6;
                parameters.set(key, value);
            });
        }
        return collectionUri + "\\" + LinkHelper.getTcmRelativeUrl(config.$projectName) + "\\" + LinkHelper.getQueryParameter(parameters);
    }
    static getTestTabLinkInRelease(config) {
        var collectionUri = config.$teamUri;
        const queryParams = new Map();
        queryParams.set("releaseId", config.$pipelineId.toString());
        queryParams.set("_a", LinkHelper.ReleaseEnvironmentExtension);
        queryParams.set("environmentId", config.$environmentId.toString());
        queryParams.set("extensionId", LinkHelper.ReleaseLinkTestExtensionId);
        return collectionUri + "/" + config.$projectName + "/" + LinkHelper.ReleaseProgressView + LinkHelper.getQueryParameter(queryParams);
    }
    static getWorkItemLink(config, workItemId) {
        const queryParams = new Map();
        queryParams.set("id", workItemId.toString());
        return config.$teamUri + "/" + LinkHelper.getWorkItemRelativeUrl(config.$projectName) + "/" + LinkHelper.getQueryParameter(queryParams);
    }
    static getBuildRelativeUrl(projectName) {
        return projectName + "/" + LinkHelper.BuildPipelineExtension;
    }
    static getTestTabLinkInBuild(config) {
        var collectionUri = config.$teamUri;
        var parameters = new Map([
            ["buildId", config.$pipelineId.toString()],
            ["view", "ms.vss-test-web.build-test-results-tab"]
        ]);
        var uri = this.getBuildLink(config, collectionUri, parameters);
        return uri;
    }
    static getTcmRelativeUrl(projectName) {
        return projectName + "/" + LinkHelper.TcmPipelineExtension;
    }
    static getWorkItemRelativeUrl(projectName) {
        return projectName + "/" + LinkHelper.WorkItemPipelineExtension;
    }
    static getTestTabLink(pipelineConfiguration) {
        return pipelineConfiguration.$pipelineType == PipelineType_1.PipelineType.Release ?
            this.getTestTabLinkInRelease(pipelineConfiguration) :
            this.getTestTabLinkInBuild(pipelineConfiguration);
    }
}
exports.LinkHelper = LinkHelper;
LinkHelper.TcmPipelineExtension = "_TestManagement/Runs";
// Release related strings
LinkHelper.ReleaseProgressView = "_releaseProgress";
LinkHelper.ReleaseDefView = "_releaseDefinition";
LinkHelper.ReleaseEnvironmentExtension = "release-environment-extension";
LinkHelper.ReleaseEnvironmentLogsExtension = "release-environment-logs";
LinkHelper.ReleaseLinkTestExtensionId = "ms.vss-test-web.test-result-in-release-environment-editor-tab";
LinkHelper.WorkItemPipelineExtension = "_workitems";
LinkHelper.BuildPipelineExtension = "_build";
//# sourceMappingURL=LinkHelper.js.map