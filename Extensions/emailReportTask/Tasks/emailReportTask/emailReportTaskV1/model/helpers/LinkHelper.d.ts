import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestCaseResult } from "azure-devops-node-api/interfaces/TestInterfaces";
export declare class LinkHelper {
    private static readonly TcmPipelineExtension;
    private static readonly ReleaseProgressView;
    private static readonly ReleaseDefView;
    private static readonly ReleaseEnvironmentExtension;
    private static readonly ReleaseEnvironmentLogsExtension;
    private static readonly ReleaseLinkTestExtensionId;
    private static readonly WorkItemPipelineExtension;
    private static readonly BuildPipelineExtension;
    static getBuildDefinitionLinkById(definitionId: any, config: PipelineConfiguration): string;
    private static getBuildLink;
    static getCommitLink(changeId: string, changeUri: string, config: PipelineConfiguration): string;
    static getCreateBugLinkForTest(config: PipelineConfiguration, testResult: TestCaseResult): string;
    static getQueryParameter(parameterValues: Map<string, string>): string;
    static getReleaseDefinitionLink(config: PipelineConfiguration, releaseDefinitionId: number): string;
    static getReleaseLogsTabLink(config: PipelineConfiguration): string;
    static getReleaseSummaryLink(config: PipelineConfiguration): string;
    static getTestResultLink(config: PipelineConfiguration, runId: string, resultId: number, queryParams?: Map<string, string>): string;
    static getTestTabLinkInRelease(config: PipelineConfiguration): string;
    static getWorkItemLink(config: PipelineConfiguration, workItemId: number): string;
    private static getBuildRelativeUrl;
    static getTestTabLinkInBuild(config: PipelineConfiguration): string;
    private static getTcmRelativeUrl;
    private static getWorkItemRelativeUrl;
    static getTestTabLink(pipelineConfiguration: PipelineConfiguration): string;
}
