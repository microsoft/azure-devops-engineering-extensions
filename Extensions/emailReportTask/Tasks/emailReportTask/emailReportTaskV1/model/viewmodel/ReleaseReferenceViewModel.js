"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseReferenceViewModel = void 0;
const LinkHelper_1 = require("../helpers/LinkHelper");
class ReleaseReferenceViewModel {
    constructor(config, releaseReference) {
        this.Id = releaseReference.id;
        this.Name = releaseReference.name;
        this.Url = LinkHelper_1.LinkHelper.getReleaseSummaryLink(config);
    }
}
exports.ReleaseReferenceViewModel = ReleaseReferenceViewModel;
//# sourceMappingURL=ReleaseReferenceViewModel.js.map