"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_messages_json_1 = __importDefault(require("./user_messages.json"));
require("./StringExtensions");
var CommentContentFactory = /** @class */ (function () {
    function CommentContentFactory() {
    }
    CommentContentFactory.prototype.createIterationHeader = function (buildIteration) {
        return user_messages_json_1.default.newIterationCommentHeading.format(buildIteration);
    };
    CommentContentFactory.prototype.createTableHeader = function (isFailure, targetBranchName, percentile) {
        if (isFailure) {
            return user_messages_json_1.default.failureCommentTableHeading.format(targetBranchName, targetBranchName);
        }
        return user_messages_json_1.default.longRunningValidationCommentTableHeading.format(percentile, targetBranchName, targetBranchName);
    };
    CommentContentFactory.prototype.createTableSection = function (current, mostRecent, target, type, longRunningValidations, thresholdTimes) {
        if (current.isFailure()) {
            if (mostRecent.isFailure()) {
                return user_messages_json_1.default.failureCommentRow.format(current.getDisplayName(), current.getLink(), String(target.getPipelineFailStreak()), target.getTruncatedName(), type, target.getTruncatedName(), mostRecent.getDisplayName(), mostRecent.getLink());
            }
            return user_messages_json_1.default.successCommentRow.format(current.getDisplayName(), current.getLink(), target.getTruncatedName(), type);
        }
        var section;
        for (var index = 0; index < longRunningValidations.size; index++) {
            var taskId = Object.keys(longRunningValidations)[index];
            if (index == 0) {
                section = user_messages_json_1.default.longRunningValidationCommentFirstSectionRow.format(current.getDisplayName(), taskId, String(longRunningValidations.get(taskId)), String(thresholdTimes.get(taskId)), mostRecent.getDisplayName(), mostRecent.getLink());
            }
            else {
                section += "\n" + user_messages_json_1.default.longRunningValidationCommentLowerSectionRow.format(taskId, String(longRunningValidations.get(taskId)), String(thresholdTimes.get(taskId)));
            }
        }
        return section;
    };
    return CommentContentFactory;
}());
exports.CommentContentFactory = CommentContentFactory;
