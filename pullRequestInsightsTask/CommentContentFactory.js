"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_messages_json_1 = __importDefault(require("./user_messages.json"));
require("./StringExtensions");
var CommentFactory = /** @class */ (function () {
    function CommentFactory() {
    }
    CommentFactory.prototype.createHeader = function (buildIteration) {
        return user_messages_json_1.default.failureCommentHeading.format(buildIteration);
    };
    CommentFactory.prototype.createRow = function (isFailure, pipelineDisplayName, pipelineLink, pipelineFailStreak, targetName, type, recentFailedPipelineName, recentFailedPipelineLink) {
        if (isFailure) {
            return user_messages_json_1.default.failureCommentRow.format(pipelineDisplayName, pipelineLink, pipelineFailStreak, targetName, type, targetName, recentFailedPipelineName, recentFailedPipelineLink);
        }
        return user_messages_json_1.default.successCommentRow.format(pipelineDisplayName, pipelineLink, targetName, type);
    };
    return CommentFactory;
}());
exports.CommentFactory = CommentFactory;
