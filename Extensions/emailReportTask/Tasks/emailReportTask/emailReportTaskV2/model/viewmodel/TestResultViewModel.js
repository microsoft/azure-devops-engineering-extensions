"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultViewModel = exports.TestResultViewModelWrapper = void 0;
const WorkItemViewModel_1 = require("./WorkItemViewModel");
const StringUtils_1 = require("../../utils/StringUtils");
const LinkHelper_1 = require("../helpers/LinkHelper");
const TimeFormatter_1 = require("../helpers/TimeFormatter");
const DisplayNameHelper_1 = require("../../utils/DisplayNameHelper");
const ReleaseReferenceViewModel_1 = require("./ReleaseReferenceViewModel");
const PipelineType_1 = require("../../config/pipeline/PipelineType");
const BuildReferenceViewModel_1 = require("./BuildReferenceViewModel");
const util_1 = require("util");
class TestResultViewModelWrapper {
}
exports.TestResultViewModelWrapper = TestResultViewModelWrapper;
class TestResultViewModel {
    constructor(testResultModel, config) {
        this.StackTraceLineCount = 5;
        const result = testResultModel.testResult;
        this.Id = result.id;
        this.TestCaseTitle = result.testCaseTitle;
        this.ErrorMessage = "<![CDATA[" + StringUtils_1.StringUtils.ReplaceNewlineWithBrTag(result.errorMessage) + "]]>";
        this.TestOutcome = result.outcome;
        this.StackTrace = "<![CDATA[" + StringUtils_1.StringUtils.ReplaceNewlineWithBrTag(StringUtils_1.StringUtils.getFirstNLines(result.stackTrace, this.StackTraceLineCount)) + "]]>";
        if (result.priority != 255) {
            this.Priority = DisplayNameHelper_1.DisplayNameHelper.getPriorityDisplayName(result.priority == null ? "" : result.priority.toString());
        }
        this.InitializeAssociatedBugs(config, testResultModel.associatedBugs);
        this.Url = LinkHelper_1.LinkHelper.getTestResultLink(config, result.testRun.id, this.Id);
        this.Owner = result.owner == null ? null : result.owner.displayName;
        if (result.failingSince != null) {
            const failingSincePipeline = config.$pipelineType == PipelineType_1.PipelineType.Build ? result.failingSince.release : result.failingSince.build;
            const failingSinceNotCurrent = failingSincePipeline == null ? false : failingSincePipeline.id != config.$pipelineId;
            if (failingSinceNotCurrent) {
                this.FailingSinceTime = result.failingSince.date.toDateString();
                if (result.failingSince.release != null && result.failingSince.release.id > 0) {
                    this.FailingSinceRelease = new ReleaseReferenceViewModel_1.ReleaseReferenceViewModel(config, result.failingSince.release);
                }
                if (result.failingSince.build != null && result.failingSince.build.id > 0) {
                    this.FailingSinceBuild = new BuildReferenceViewModel_1.BuildReferenceViewModel(config, null, result.failingSince.build);
                }
            }
        }
        if (util_1.isNullOrUndefined(result.durationInMs)) {
            if (!util_1.isNullOrUndefined(result.startedDate) && !util_1.isNullOrUndefined(result.completedDate)) {
                result.durationInMs = result.completedDate.getTime() - result.startedDate.getTime();
            }
            if (util_1.isNullOrUndefined(result.durationInMs) || result.durationInMs < 0) {
                // unknown duration - assume test didn't run instead of displaying "Undefined/NaN" in email
                result.durationInMs = 0;
            }
        }
        this.Duration = TimeFormatter_1.TimeFormatter.FormatDuration(result.durationInMs);
        this.CreateBugLink = LinkHelper_1.LinkHelper.getCreateBugLinkForTest(config, testResultModel.testResult);
    }
    InitializeAssociatedBugs(config, associatedBugs) {
        this.AssociatedBugs = new WorkItemViewModel_1.WorkItemViewModelWrapper();
        this.AssociatedBugs.WorkItemViewModel = [];
        if (associatedBugs == null) {
            return;
        }
        associatedBugs.forEach(workItem => {
            if (workItem.id != null) {
                this.AssociatedBugs.WorkItemViewModel.push(new WorkItemViewModel_1.WorkItemViewModel(config, workItem));
            }
        });
    }
}
exports.TestResultViewModel = TestResultViewModel;
//# sourceMappingURL=TestResultViewModel.js.map