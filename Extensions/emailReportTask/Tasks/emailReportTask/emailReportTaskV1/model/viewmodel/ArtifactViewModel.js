"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactViewModel = exports.ArtifactViewModelWrapper = void 0;
const util_1 = require("util");
class ArtifactViewModelWrapper {
}
exports.ArtifactViewModelWrapper = ArtifactViewModelWrapper;
class ArtifactViewModel {
    constructor(artifact, config) {
        this.Version = this.getArtifactInfo(artifact, "version");
        this.BranchName = this.getArtifactInfo(artifact, "branch");
        this.Name = artifact.alias;
        this.IsPrimary = artifact.isPrimary;
        if (!util_1.isNullOrUndefined(artifact.definitionReference)) {
            if (!util_1.isNullOrUndefined(artifact.definitionReference.artifactSourceDefinitionUrl) &&
                !util_1.isNullOrUndefined(artifact.definitionReference.artifactSourceDefinitionUrl.id)) {
                this.ArtifactDefinitionUrl = artifact.definitionReference.artifactSourceDefinitionUrl.id;
            }
            if (!util_1.isNullOrUndefined(artifact.definitionReference.artifactSourceVersionUrl) &&
                !util_1.isNullOrUndefined(artifact.definitionReference.artifactSourceVersionUrl.id)) {
                this.BuildSummaryUrl = artifact.definitionReference.artifactSourceVersionUrl.id;
            }
        }
    }
    getArtifactInfo(artifact, key) {
        const sourceRef = artifact.definitionReference[key];
        return util_1.isNullOrUndefined(sourceRef) ? null : sourceRef.name;
    }
}
exports.ArtifactViewModel = ArtifactViewModel;
//# sourceMappingURL=ArtifactViewModel.js.map