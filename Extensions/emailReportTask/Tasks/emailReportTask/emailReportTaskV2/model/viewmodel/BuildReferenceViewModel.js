"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildReferenceViewModel = void 0;
const LinkHelper_1 = require("../helpers/LinkHelper");
const util_1 = require("util");
class BuildReferenceViewModel {
    constructor(config, buildReference, build) {
        if (buildReference != null) {
            this.Id = buildReference.id.toString();
            this.Number = buildReference.buildNumber;
            if (!util_1.isNullOrUndefined(buildReference._links) && !util_1.isNullOrUndefined(buildReference._links.web) && !util_1.isNullOrUndefined(buildReference._links.web.href)) {
                this.Url = buildReference._links.web.href;
            }
        }
        else if (build != null) {
            this.Id = build.id.toString();
            this.Number = build.buildNumber;
            this.Branch = build.sourceBranch;
            if (!util_1.isNullOrUndefined(build._links) && !util_1.isNullOrUndefined(build._links.web) && !util_1.isNullOrUndefined(build._links.web.href)) {
                this.Url = build._links.web.href;
            }
            this.DefinitionUrl = LinkHelper_1.LinkHelper.getBuildDefinitionLinkById(build.definition.id, config);
            this.DefinitionName = build.definition.name;
        }
    }
}
exports.BuildReferenceViewModel = BuildReferenceViewModel;
//# sourceMappingURL=BuildReferenceViewModel.js.map