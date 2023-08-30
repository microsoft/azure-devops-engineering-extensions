"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineConfiguration = void 0;
const PipelineType_1 = require("./PipelineType");
const LinkHelper_1 = require("../../model/helpers/LinkHelper");
class PipelineConfiguration {
    constructor($pipelineType, $pipelineId, $projectId, $projectName, $environmentId, $environmentDefinitionId, $usePreviousEnvironment, $teamUri, $accessKey) {
        this.pipelineType = $pipelineType;
        this.pipelineId = $pipelineId;
        this.projectId = $projectId;
        this.projectName = $projectName;
        this.environmentId = $environmentId;
        this.environmentDefinitionId = $environmentDefinitionId;
        this.usePreviousEnvironment = $usePreviousEnvironment;
        this.teamUri = $teamUri;
        this.accessKey = $accessKey;
    }
    /**
   * Getter $pipelineId
   * @return {number}
   */
    get $pipelineType() {
        return this.pipelineType;
    }
    /**
     * Getter $pipelineId
     * @return {number}
     */
    get $pipelineId() {
        return this.pipelineId;
    }
    /**
     * Getter $projectId
     * @return {string}
     */
    get $projectId() {
        return this.projectId;
    }
    /**
     * Getter $projectName
     * @return {string}
     */
    get $projectName() {
        return this.projectName;
    }
    /**
     * Getter $environmentId
     * @return {number}
     */
    get $environmentId() {
        return this.environmentId;
    }
    /**
     * Getter $environmentDefinitionId
     * @return {number}
     */
    get $environmentDefinitionId() {
        return this.environmentDefinitionId;
    }
    /**
  * Getter $usePreviousEnvironment
  * @return {boolean}
  */
    get $usePreviousEnvironment() {
        return this.usePreviousEnvironment;
    }
    /**
     * Getter $teamUri
     * @return {string}
     */
    get $teamUri() {
        return this.teamUri;
    }
    /**
     * Getter $accessKey
     * @return {string}
     */
    get $accessKey() {
        return this.accessKey;
    }
    getTestTabLink() {
        if (this.testTabLink == null) {
            if (this.pipelineType == PipelineType_1.PipelineType.Release) {
                this.testTabLink = LinkHelper_1.LinkHelper.getTestTabLinkInRelease(this);
            }
            else if (this.pipelineType == PipelineType_1.PipelineType.Build) {
                this.testTabLink = LinkHelper_1.LinkHelper.getTestTabLinkInBuild(this);
            }
        }
        return this.testTabLink;
    }
}
exports.PipelineConfiguration = PipelineConfiguration;
//# sourceMappingURL=PipelineConfiguration.js.map