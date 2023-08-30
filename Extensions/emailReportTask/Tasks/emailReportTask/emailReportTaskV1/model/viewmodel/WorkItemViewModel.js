"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkItemViewModel = exports.WorkItemViewModelWrapper = void 0;
const LinkHelper_1 = require("../helpers/LinkHelper");
const StringUtils_1 = require("../../utils/StringUtils");
const util_1 = require("util");
class WorkItemViewModelWrapper {
}
exports.WorkItemViewModelWrapper = WorkItemViewModelWrapper;
class WorkItemViewModel {
    constructor(config, workItem) {
        if (workItem.id != null) {
            this.Id = workItem.id;
            this.Url = LinkHelper_1.LinkHelper.getWorkItemLink(config, workItem.id);
        }
        this.Title = workItem.fields["System.Title"];
        // This is for display in email report only
        var assignToRef = workItem.fields["System.AssignedTo"];
        // Prefer Display name to Unique Name in report
        this.AssignedTo = util_1.isNullOrUndefined(assignToRef) ? "" : (StringUtils_1.StringUtils.isNullOrWhiteSpace(assignToRef.displayName) ? assignToRef.uniqueName : assignToRef.displayName);
        // Unassigned workitem
        this.AssignedTo = util_1.isNullOrUndefined(this.AssignedTo) ? "" : this.AssignedTo;
        this.State = workItem.fields["System.State"];
        this.ChangedDate = workItem.fields["System.ChangedDate"];
    }
}
exports.WorkItemViewModel = WorkItemViewModel;
//# sourceMappingURL=WorkItemViewModel.js.map