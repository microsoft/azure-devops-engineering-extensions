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
    PullRequest.prototype.manageFailureComments = function (apiCaller, currentBuildIteration) {
        return __awaiter(this, void 0, void 0, function () {
            var currentServiceComments, _a, currentIterationCommentId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getCurrentServiceComments;
                        return [4 /*yield*/, apiCaller.getCommentThreads(this.id, this.repository, this.projectName)];
                    case 1:
                        currentServiceComments = _a.apply(this, [_b.sent()]);
                        currentIterationCommentId = this.getCurrentIterationCommentId(currentServiceComments, currentBuildIteration);
                        tl.debug("current build iteration: " + currentBuildIteration + " and comment id for this iteration: " + currentIterationCommentId);
                        this.deactivateOldComments(apiCaller, currentIterationCommentId);
                        this.editComment(apiCaller, currentIterationCommentId);
                        return [2 /*return*/];
                }
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
                                tl.debug("comment to be deactivated: " + commentThread.id);
                                apiCaller.updateCommentThread({ status: azureGitInterfaces.CommentThreadStatus.Closed }, this.id, this.repository, this.projectName, commentThread.id);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PullRequest.prototype.editComment = function (apiCaller, currentIterationCommentId) {
    };
    PullRequest.prototype.getCurrentIterationCommentId = function (commentThreads, currentBuildIteration) {
        for (var _i = 0, _a = this.getCurrentServiceComments(commentThreads); _i < _a.length; _i++) {
            var commentThread = _a[_i];
            for (var _b = 0, _c = commentThread.comments; _b < _c.length; _b++) {
                var comment = _c[_b];
                if (this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration) {
                    tl.debug("current iteration comment content: " + comment.content);
                    return commentThread.id;
                }
            }
        }
        return null;
    };
    PullRequest.prototype.getBuildIterationFromServiceComment = function (serviceCommentContent) {
        var splitContent = serviceCommentContent.split("\|");
        splitContent.shift();
        if (splitContent.length > 0) {
            return (splitContent[0].split(" ").slice(2)).join(" ");
        }
        return null;
    };
    PullRequest.prototype.getCurrentServiceComments = function (commentThreads) {
        var currentServiceThreads = [];
        for (var _i = 0, commentThreads_1 = commentThreads; _i < commentThreads_1.length; _i++) {
            var commentThread = commentThreads_1[_i];
            for (var _a = 0, _b = commentThread.comments; _a < _b.length; _a++) {
                var comment = _b[_a];
                if (this.commentIsFromService(comment.content, PullRequest.COMMENT)) {
                    tl.debug("the comment " + comment.content + " is from service");
                    currentServiceThreads.push(commentThread);
                }
            }
        }
        return currentServiceThreads;
    };
    PullRequest.prototype.commentIsFromService = function (commentContent, commentFormatString) {
        // tl.debug("regex = " + this.convertCommentFormatToRegex(commentFormatString) + " actual comment " + commentContent);
        return this.convertCommentFormatToRegex(commentFormatString).test(commentContent);
    };
    PullRequest.prototype.convertCommentFormatToRegex = function (commentFormatString) {
        var regex = commentFormatString.split("\n")[0];
        regex = regex.replace(/{(\d+)}/g, ".*").replace(/\|/g, '\\|');
        // tl.debug("format string regex: " + new RegExp(regex));
        return new RegExp(regex);
    };
    PullRequest.COMMENT = user_messages_json_1.default.failureComment;
    return PullRequest;
}());
exports.PullRequest = PullRequest;
