"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseViewModel = void 0;
const LinkHelper_1 = require("../helpers/LinkHelper");
const ReleaseEnvironmentViewModel_1 = require("./ReleaseEnvironmentViewModel");
const util_1 = require("util");
class ReleaseViewModel {
    constructor(currentEnvironment, releaseConfig) {
        if (currentEnvironment != null) {
            this.CurrentEnvironment = new ReleaseEnvironmentViewModel_1.ReleaseEnvironmentViewModel(currentEnvironment);
            this.ReleaseDefinitionName = currentEnvironment.releaseDefinition == null ? null : currentEnvironment.releaseDefinition.name;
            if (currentEnvironment.releaseDefinition != null) {
                this.ReleaseDefinitionUrl = LinkHelper_1.LinkHelper.getReleaseDefinitionLink(releaseConfig, currentEnvironment.releaseDefinition.id);
            }
            this.ReleaseName = currentEnvironment.release == null ? null : currentEnvironment.release.name;
        }
        this.ReleaseId = releaseConfig.$pipelineId;
        if (!util_1.isNullOrUndefined(currentEnvironment.release) && !util_1.isNullOrUndefined(currentEnvironment.release._links) && !util_1.isNullOrUndefined(currentEnvironment.release._links.web)) {
            this.ReleaseSummaryUrl = currentEnvironment.release._links.web.href;
        }
        this.ReleaseLogsLink = LinkHelper_1.LinkHelper.getReleaseLogsTabLink(releaseConfig);
    }
}
exports.ReleaseViewModel = ReleaseViewModel;
//# sourceMappingURL=ReleaseViewModel.js.map