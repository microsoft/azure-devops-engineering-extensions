"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureGitInterfaces = __importStar(require("azure-devops-node-api/interfaces/GitInterfaces"));
var user_messages_json_1 = __importDefault(require("./user_messages.json"));
var tl = require("azure-pipelines-task-lib/task");
var PullRequest = /** @class */ (function () {
    function PullRequest(id, repository, projectName) {
        this.id = id;
        this.repository = repository;
        this.projectName = projectName;
    }
    PullRequest.prototype.addNewComment = function (apiCaller, commentContent) {
        return __awaiter(this, void 0, void 0, function () {
            var thread;
            return __generator(this, function (_a) {
                thread = { comments: new Array({ content: commentContent }) };
                tl.debug(user_messages_json_1.default.commentCompletedMessage);
                return [2 /*return*/, apiCaller.postNewCommentThread(thread, this.id, this.repository, this.projectName)];
            });
        });
    };
    PullRequest.prototype.deactivateOldComments = function (apiCaller, currentIterationCommentId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceComments, _a, _i, serviceComments_1, commentThread;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getCurrentServiceComments;
                        return [4 /*yield*/, apiCaller.getCommentThreads(this.id, this.repository, this.projectName)];
                    case 1:
                        serviceComments = _a.apply(this, [_b.sent()]);
                        for (_i = 0, serviceComments_1 = serviceComments; _i < serviceComments_1.length; _i++) {
                            commentThread = serviceComments_1[_i];
                            if (commentThread.id != currentIterationCommentId && (commentThread.status === azureGitInterfaces.CommentThreadStatus.Active || commentThread.status === undefined)) {
                                tl.debug("comment thread id to be deactivated: " + commentThread.id);
                                apiCaller.updateCommentThread({ status: azureGitInterfaces.CommentThreadStatus.Closed }, this.id, this.repository, this.projectName, commentThread.id);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PullRequest.prototype.editMatchingCommentInThread = function (apiCaller, thread, contentToAdd, currentBuildIteration) {
        for (var _i = 0, _a = thread.comments; _i < _a.length; _i++) {
            var comment = _a[_i];
            if (this.commentIsFromService(comment.content, user_messages_json_1.default.failureCommentHeading) && this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration) {
                var updatedContent = comment.content + contentToAdd;
                tl.debug("comment to be updated: thread id = " + thread.id + ", comment id = " + comment.id);
                apiCaller.updateComment({ content: updatedContent }, this.id, this.repository, this.projectName, thread.id, comment.id);
                break;
            }
        }
    };
    PullRequest.prototype.getCurrentIterationCommentThread = function (apiCaller, currentBuildIteration) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, commentThread, _c, _d, comment;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _i = 0;
                        _b = this.getCurrentServiceComments;
                        return [4 /*yield*/, apiCaller.getCommentThreads(this.id, this.repository, this.projectName)];
                    case 1:
                        _a = _b.apply(this, [_e.sent()]);
                        _e.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        commentThread = _a[_i];
                        for (_c = 0, _d = commentThread.comments; _c < _d.length; _c++) {
                            comment = _d[_c];
                            if (this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration) {
                                tl.debug("comment thread id of thread of current build iteration " + currentBuildIteration + ": thread id = " + commentThread.id + ", comment id = " + comment.id);
                                return [2 /*return*/, commentThread];
                            }
                        }
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 2];
                    case 4:
                        tl.debug("no comment was found for build iteration " + currentBuildIteration);
                        return [2 /*return*/, null];
                }
            });
        });
    };
    PullRequest.prototype.getBuildIterationFromServiceComment = function (serviceCommentContent) {
        var splitContent = serviceCommentContent.split("\|");
        splitContent.shift();
        if (splitContent.length > 0) {
            return (splitContent[0].split(" ").slice(2)).join(" ");
        }
        tl.debug("no build iteration was found in comment content: " + serviceCommentContent);
        return null;
    };
    PullRequest.prototype.getCurrentServiceComments = function (commentThreads) {
        var currentServiceThreads = [];
        for (var _i = 0, commentThreads_1 = commentThreads; _i < commentThreads_1.length; _i++) {
            var commentThread = commentThreads_1[_i];
            for (var _a = 0, _b = commentThread.comments; _a < _b.length; _a++) {
                var comment = _b[_a];
                if (this.commentIsFromService(comment.content, PullRequest.COMMENT)) {
                    tl.debug("the comment: thread id = " + commentThread.id + ", comment id = " + comment.id + "is from service");
                    currentServiceThreads.push(commentThread);
                }
                else {
                    tl.debug("the comment: thread id = " + commentThread.id + ", comment id = " + comment.id + "is not from service");
                }
            }
        }
        return currentServiceThreads;
    };
    PullRequest.prototype.commentIsFromService = function (commentContent, commentFormatString) {
        return this.convertCommentFormatToRegex(commentFormatString).test(commentContent);
    };
    PullRequest.prototype.convertCommentFormatToRegex = function (commentFormatString) {
        var regex = commentFormatString.split("\n")[0];
        regex = regex.replace(/{(\d+)}/g, ".*").replace(/\|/g, '\\|');
        return new RegExp(regex);
    };
    PullRequest.COMMENT = user_messages_json_1.default.failureCommentHeading + user_messages_json_1.default.failureCommentRow;
    return PullRequest;
}());
exports.PullRequest = PullRequest;
