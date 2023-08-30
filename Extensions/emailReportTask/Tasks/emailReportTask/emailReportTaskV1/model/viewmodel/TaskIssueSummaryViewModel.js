"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueTypeConstants = exports.TaskIssueSummaryViewModel = void 0;
const TaskIssueViewModel_1 = require("./TaskIssueViewModel");
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const StringUtils_1 = require("../../utils/StringUtils");
class TaskIssueSummaryViewModel {
    constructor(tasks) {
        this.ErrorMessage = "";
        this.ErrorCount = 0;
        this.WarningCount = 0;
        var allIssues = [];
        this.ErrorMessage = `Failed on ${tasks.filter(t => t.$status == ReleaseInterfaces_1.TaskStatus.Failed || t.$status == ReleaseInterfaces_1.TaskStatus.Canceled).length}/${tasks.length} Agents`;
        tasks.forEach(task => {
            if (task.$issues != null && task.$issues.length > 0) {
                task.$issues.forEach(issue => {
                    if (!StringUtils_1.StringUtils.isNullOrWhiteSpace(issue.$message)) {
                        if (issue.$issueType.toLowerCase() == IssueTypeConstants.Error) {
                            this.ErrorCount++;
                        }
                        else if (issue.$issueType.toLowerCase() == IssueTypeConstants.Warning) {
                            this.WarningCount++;
                        }
                        allIssues.push(new TaskIssueViewModel_1.TaskIssueViewModel(issue.$message, issue.$issueType, task.$agentName));
                    }
                });
            }
        });
        this.Issues = new TaskIssueViewModel_1.TaskIssueViewModelWrapper();
        this.Issues.TaskIssueViewModel = this.TruncateIssues(allIssues);
    }
    TruncateIssues(issues, characterLimit = 1000) {
        const truncatedIssues = [];
        var warningIssues = issues.filter(t => t.IssueType.toLowerCase() != IssueTypeConstants.Error);
        var errorIssues = issues.filter(t => t.IssueType.toLowerCase() == IssueTypeConstants.Error);
        const sortedIssues = [];
        sortedIssues.push(...warningIssues);
        sortedIssues.push(...errorIssues);
        let currentCharCount = 0;
        for (var i = 0; i < sortedIssues.length; i++) {
            const issue = sortedIssues[i];
            if (currentCharCount >= characterLimit) {
                return truncatedIssues;
            }
            issue.Message = issue.Message.substring(0, characterLimit - currentCharCount);
            currentCharCount += issue.Message.length;
            truncatedIssues.push(issue);
        }
        return truncatedIssues;
    }
}
exports.TaskIssueSummaryViewModel = TaskIssueSummaryViewModel;
class IssueTypeConstants {
}
exports.IssueTypeConstants = IssueTypeConstants;
IssueTypeConstants.Error = "error";
IssueTypeConstants.Warning = "warning";
//# sourceMappingURL=TaskIssueSummaryViewModel.js.map