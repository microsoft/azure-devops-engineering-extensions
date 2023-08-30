"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskIssueViewModel = exports.TaskIssueViewModelWrapper = void 0;
class TaskIssueViewModelWrapper {
}
exports.TaskIssueViewModelWrapper = TaskIssueViewModelWrapper;
class TaskIssueViewModel {
    constructor(issueMessage, issueType, agentName) {
        this.Message = `(${agentName}) ${issueMessage.trim()}`;
        this.IssueType = issueType;
        this.AgentName = agentName;
    }
}
exports.TaskIssueViewModel = TaskIssueViewModel;
//# sourceMappingURL=TaskIssueViewModel.js.map