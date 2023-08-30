"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeViewModel = exports.ChangeViewModelWrapper = void 0;
const StringUtils_1 = require("../../utils/StringUtils");
const LinkHelper_1 = require("../helpers/LinkHelper");
class ChangeViewModelWrapper {
}
exports.ChangeViewModelWrapper = ChangeViewModelWrapper;
class ChangeViewModel {
    constructor(change, config) {
        this.ConstHashLength = 8;
        this.Id = change.$id;
        this.ShortId = isNaN(Number.parseInt(this.Id)) ? this.Id : this.Id.substring(0, this.ConstHashLength);
        this.Message = StringUtils_1.StringUtils.CompressNewLines(change.$message);
        this.AuthorName = change.$author == null ? null : change.$author.displayName;
        this.TimeStamp = change.$timeStamp.toDateString();
        this.Url = LinkHelper_1.LinkHelper.getCommitLink(change.$id, change.$location, config);
    }
}
exports.ChangeViewModel = ChangeViewModel;
//# sourceMappingURL=ChangeViewModel.js.map