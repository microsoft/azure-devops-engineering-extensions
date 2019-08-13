import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Artifact, ArtifactSourceReference } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { TestCaseResult } from "azure-devops-node-api/interfaces/TestInterfaces";
import { isNullOrUndefined } from "util";
import { PipelineType } from "../../config/pipeline/PipelineType";

export class LinkHelper {
  private static readonly TcmPipelineExtension = "_TestManagement/Runs";

  // Release related strings
  private static readonly ReleaseProgressView = "_releaseProgress";
  private static readonly ReleaseDefView = "_releaseDefinition";
  private static readonly ReleaseEnvironmentExtension = "release-environment-extension";
  private static readonly ReleaseLinkTestExtensionId = "ms.vss-test-web.test-result-in-release-environment-editor-tab";

  private static readonly WorkItemPipelineExtension = "_workitems";
  private static readonly BuildPipelineExtension = "_build";

  public static getBuildDefinitionLinkByArtifact(artifact: Artifact, config: PipelineConfiguration): string {
    const sourceRef = this.getArtifactInfo(artifact, "definition");
    return this.getBuildDefinitionLinkById(
      sourceRef == null ? null : sourceRef.id,
      config);
  }

  public static getBuildDefinitionLinkById(definitionId: any, config: PipelineConfiguration): string {
    var collectionUri = config.$teamUri;
    var parameters = new Map<string, string>();
    parameters.set("definitionId", definitionId.toString());
    parameters.set("_a", "completed");
    var uri = this.getBuildLink(config, collectionUri, parameters);

    return uri;
  }

  public static getBuildSummaryLinkByArtifact(artifact: Artifact, config: PipelineConfiguration): string {
    const sourceRef = this.getArtifactInfo(artifact, "definition");
    return this.getBuildSummaryLinkById(
      sourceRef == null ? null : sourceRef.id,
      config);
  }

  public static getBuildSummaryLinkById(buildId: any, config: PipelineConfiguration): string {
    var collectionUri = config.$teamUri;
    var parameters = new Map<string, string>();
    parameters.set("buildId", buildId.toString());
    var uri = this.getBuildLink(config, collectionUri, parameters);

    return uri;
  }

  private static getBuildLink(config: PipelineConfiguration, collectionUri: string, parameters: Map<string, string>): string {
    return collectionUri + "/" + this.getBuildRelativeUrl(config.$projectName) + "/" + this.getQueryParameter(parameters);
  }

  public static getCommitLink(changeId: string, changeUri: string, config: PipelineConfiguration): string {
    var collectionUri = config.$teamUri;
    let repoId = null;
    var pos = changeUri.indexOf("repositories");
    if (pos > 0) {
      repoId = changeUri.substr(pos).split("/")[1];
    }

    var uri = collectionUri + `/${config.$projectName}/_git/${repoId}/commit/${changeId})`;
    return uri;
  }

  public static getCreateBugLinkForTest(config: PipelineConfiguration, testResult: TestCaseResult): string {
    const testRunId = testResult.testRun == null ? null : testResult.testRun.id;
    const parameters = new Map<string, string>();
    parameters.set("create-bug", "true");
    return LinkHelper.getTestResultLink(config, testRunId, testResult.id, parameters);
  }

  public static getQueryParameter(parameterValues: Map<string, string>): string {
    var queryString = "";
    parameterValues.forEach((value: string, key: string) => {
      queryString = (queryString == "")
        ? "?" + key + "=" + value
        : queryString + "&" + key + "=" + value;
    });

    return queryString;
  }

  public static getReleaseDefinitionLink(config: PipelineConfiguration, releaseDefinitionId: number): string {
    var collectionUri = config.$teamUri;
    const parameters = new Map<string, string>();
    parameters.set("definitionId", releaseDefinitionId.toString());
    parameters.set("_a", "environments-editor");

    return collectionUri + "/" + config.$projectName + "/" + LinkHelper.ReleaseDefView + "/" + LinkHelper.getQueryParameter(parameters);
  }

  public static getReleaseLogsTabLink(config: PipelineConfiguration): string {
    return LinkHelper.getReleaseLinkTab(config.$pipelineId, config, "release-logs");
  }

  public static getReleaseSummaryLink(releaseId: number, config: PipelineConfiguration): string {
    return LinkHelper.getReleaseLinkTab(releaseId, config, "release-summary");
  }


  public static getTestResultLink(config: PipelineConfiguration, runId: string, resultId: number, queryParams?: Map<string, string>): string {
    var collectionUri = config.$teamUri;
    const parameters = new Map<string, string>();
    parameters.set("runId", runId);
    parameters.set("_a", "resultSummary");
    parameters.set("resultId", resultId.toString());

    if (queryParams != null) {
      queryParams.forEach((value: string, key: string) => {
        parameters.set(key, value);
      });
    }

    return collectionUri + "\\" + LinkHelper.getTcmRelativeUrl(config.$projectName) + "\\" + LinkHelper.getQueryParameter(parameters);
  }

  public static getTestTabLinkInRelease(config: PipelineConfiguration): string {
    return LinkHelper.getReleaseLinkTab(config.$pipelineId, config, this.ReleaseLinkTestExtensionId);
  }

  public static getWorkItemLink(config: PipelineConfiguration, workItemId: number): string {
    const queryParams = new Map<string, string>();
    queryParams.set("id", workItemId.toString());

    return config.$teamUri + "/" + LinkHelper.getWorkItemRelativeUrl(config.$projectName) + "/" + LinkHelper.getQueryParameter(queryParams);
  }

  private static getArtifactInfo(artifact: Artifact, key: string): ArtifactSourceReference {
    const sourceRef = artifact.definitionReference[key];
    if (!isNullOrUndefined(sourceRef)) {
      return sourceRef;
    }

    return null;
  }

  private static getBuildRelativeUrl(projectName: string): string {
    return projectName + "/" + LinkHelper.BuildPipelineExtension;
  }

  private static getTestTabLinkInBuild(config: PipelineConfiguration) {
    var collectionUri = config.$teamUri;
    var parameters = new Map<string, string>(
      [
        ["buildId", config.$pipelineId.toString()],
        ["_a", "summary"],
        ["tab", "ms.vss-test-web.test-result-details"]
      ]);

    var uri = this.getBuildLink(config, collectionUri, parameters);
    return uri;
  }

  private static getReleaseLinkTab(releaseId: number, config: PipelineConfiguration, tab: string): string {
    var collectionUri = config.$teamUri;
    const queryParams = new Map<string, string>();
    queryParams.set("releaseId", releaseId.toString());
    queryParams.set("extensionId", tab);
    queryParams.set("_a", LinkHelper.ReleaseEnvironmentExtension);

    return collectionUri + "/" + config.$projectName + "/" + LinkHelper.ReleaseProgressView + LinkHelper.getQueryParameter(queryParams);
  }

  private static getTcmRelativeUrl(projectName: string): string {
    return projectName + "/" + LinkHelper.TcmPipelineExtension;
  }

  private static getWorkItemRelativeUrl(projectName: string): string {
    return projectName + "/" + LinkHelper.WorkItemPipelineExtension;
  }

  public static getTestTabLink(pipelineConfiguration: PipelineConfiguration): string {
    return pipelineConfiguration.$pipelineType == PipelineType.Release ?
      this.getTestTabLinkInRelease(pipelineConfiguration) :
      this.getTestTabLinkInBuild(pipelineConfiguration);
  }
}