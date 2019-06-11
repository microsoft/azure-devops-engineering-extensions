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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var azureGitInterfaces = __importStar(require("azure-devops-node-api/interfaces/GitInterfaces"));
var PullRequest_1 = require("../PullRequest");
var ts_mockito_1 = require("ts-mockito");
var ReleaseAzureApi_1 = require("../ReleaseAzureApi");
var sinon_1 = __importDefault(require("sinon"));
var user_messages_json_1 = __importDefault(require("../user_messages.json"));
require("../StringExtensions");
describe("PullRequest Tests", function () {
    var pullRequest;
    var threads;
    var mockApi;
    function makeThread(commentsContents, includeCommentIds, threadStatus, threadId) {
        var threadComments = [];
        for (var i = 0; i < commentsContents.length; i++) {
            var comment = { content: commentsContents[i] };
            if (includeCommentIds) {
                comment.id = i;
            }
            threadComments.push(comment);
        }
        return {
            comments: threadComments,
            status: threadStatus,
            id: threadId
        };
    }
    function setThreads(threadsToGet) {
        threads = threadsToGet;
        sinon_1.default.stub(mockApi, "getCommentThreads").resolves(threads);
    }
    function makeCommentContentOfCorrectForm(buildIteration, pipelineName) {
        if (!pipelineName) {
            pipelineName = "fake";
        }
        return user_messages_json_1.default.newIterationCommentHeading.format(buildIteration) + user_messages_json_1.default.failureCommentRow.format(pipelineName, "fake", "fake", "fake", "fake", "fake", "fake", "fake");
    }
    function makeCommentContentRow(pipelineName) {
        return user_messages_json_1.default.failureCommentRow.format(pipelineName, "fake", "fake", "fake", "fake", "fake", "fake", "fake");
    }
    beforeEach(function () {
        pullRequest = new PullRequest_1.PullRequest(2, "repo", "project");
        mockApi = ts_mockito_1.mock(ReleaseAzureApi_1.ReleaseAzureApi);
    });
    test("Does not find a comment thread when comments are of wrong format", function () {
        setThreads([makeThread(["|jk jk hj| failure |", "fake comment"], false), makeThread(["|jk jk hj| failure |", "fake comment"], false)]);
        expect(pullRequest.getCurrentIterationCommentThread(mockApi, "thisBuild")).toBeNull;
    });
    test("Finds comment thread when comment of same build iteration in correct format exists", function () { return __awaiter(_this, void 0, void 0, function () {
        var expectedThread, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    expectedThread = makeThread([makeCommentContentOfCorrectForm("345")], false, 5);
                    setThreads([makeThread(["|jk jk hj| failure |", "fake comment"], false), expectedThread]);
                    _a = expect;
                    return [4 /*yield*/, pullRequest.getCurrentIterationCommentThread(mockApi, "345")];
                case 1:
                    _a.apply(void 0, [(_b.sent())]).toBe(expectedThread);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Finds correct comment thread when many comment threads of correct format exist", function () { return __awaiter(_this, void 0, void 0, function () {
        var expectedThread, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    expectedThread = makeThread([makeCommentContentOfCorrectForm("400")], false, 7);
                    setThreads([makeThread(["fake comment"], false), makeThread([makeCommentContentOfCorrectForm("345")], false, 5), expectedThread]);
                    _a = expect;
                    return [4 /*yield*/, pullRequest.getCurrentIterationCommentThread(mockApi, "400")];
                case 1:
                    _a.apply(void 0, [(_b.sent())]).toBe(expectedThread);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Calls to create new thread when adding comment", function () {
        var commentContent = makeCommentContentOfCorrectForm("500");
        var expectedThread = makeThread([commentContent], false);
        var callback = jest.spyOn(mockApi, "postNewCommentThread");
        pullRequest.addNewComment(mockApi, commentContent);
        expect(callback).toBeCalledWith({ comments: expectedThread.comments }, 2, "repo", "project");
    });
    test("Only calls to deactivate comments that do not match current build iteration", function () { return __awaiter(_this, void 0, void 0, function () {
        var threadsToDeactivate, threadNotToDeactivate, callback, _a, _b, _c, _i, threadsToDeactivate_1, thread;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    threadsToDeactivate = [makeThread([makeCommentContentOfCorrectForm("90")], false, azureGitInterfaces.CommentThreadStatus.Active, 16), makeThread([makeCommentContentOfCorrectForm("800")], false, azureGitInterfaces.CommentThreadStatus.Active, 18)];
                    threadNotToDeactivate = [makeThread([makeCommentContentOfCorrectForm("750")], false, azureGitInterfaces.CommentThreadStatus.Active, 5)];
                    callback = jest.spyOn(mockApi, "updateCommentThread");
                    setThreads(threadNotToDeactivate.concat(threadsToDeactivate));
                    _b = (_a = console).log;
                    _c = "number threads: ";
                    return [4 /*yield*/, mockApi.getCommentThreads(2, "repo", "project")];
                case 1:
                    _b.apply(_a, [_c + (_d.sent()).length]);
                    return [4 /*yield*/, pullRequest.deactivateOldComments(mockApi, 5)];
                case 2:
                    _d.sent();
                    for (_i = 0, threadsToDeactivate_1 = threadsToDeactivate; _i < threadsToDeactivate_1.length; _i++) {
                        thread = threadsToDeactivate_1[_i];
                        expect(callback).toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id);
                    }
                    expect(callback).not.toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", threadNotToDeactivate[0].id);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Only calls to deactivate comments that are active or undefined", function () { return __awaiter(_this, void 0, void 0, function () {
        var threadsToDeactivate, threadsNotToDeactivate, callback, _i, threadsToDeactivate_2, thread, _a, threadsNotToDeactivate_1, thread;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    threadsToDeactivate = [makeThread([makeCommentContentOfCorrectForm("90")], false, azureGitInterfaces.CommentThreadStatus.Active, 600), makeThread([makeCommentContentOfCorrectForm("800")], false, undefined, 800)];
                    threadsNotToDeactivate = [makeThread([makeCommentContentOfCorrectForm("750")], false, azureGitInterfaces.CommentThreadStatus.Closed, 1000), makeThread([makeCommentContentOfCorrectForm("750")], false, azureGitInterfaces.CommentThreadStatus.WontFix, 900)];
                    callback = jest.spyOn(mockApi, "updateCommentThread");
                    setThreads(threadsNotToDeactivate.concat(threadsToDeactivate));
                    return [4 /*yield*/, pullRequest.deactivateOldComments(mockApi, 5)];
                case 1:
                    _b.sent();
                    for (_i = 0, threadsToDeactivate_2 = threadsToDeactivate; _i < threadsToDeactivate_2.length; _i++) {
                        thread = threadsToDeactivate_2[_i];
                        expect(callback).toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id);
                    }
                    for (_a = 0, threadsNotToDeactivate_1 = threadsNotToDeactivate; _a < threadsNotToDeactivate_1.length; _a++) {
                        thread = threadsNotToDeactivate_1[_a];
                        expect(callback).not.toBeCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test("Calls to edit only matching comment in matching thread", function () { return __awaiter(_this, void 0, void 0, function () {
        var commentContentToAddTo, commentContentToAdd, commentContentNotToAddTo, threadToEdit, callback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentContentToAddTo = makeCommentContentOfCorrectForm("500");
                    commentContentToAdd = makeCommentContentRow("release-77");
                    commentContentNotToAddTo = makeCommentContentOfCorrectForm("800");
                    threadToEdit = makeThread([commentContentNotToAddTo, commentContentToAddTo], true, azureGitInterfaces.CommentThreadStatus.Active, 10);
                    callback = jest.spyOn(mockApi, "updateComment");
                    return [4 /*yield*/, pullRequest.editMatchingCommentInThread(mockApi, threadToEdit, commentContentToAdd, "500")];
                case 1:
                    _a.sent();
                    expect(callback).toBeCalledWith({ content: commentContentToAddTo + commentContentToAdd }, 2, "repo", "project", 10, 1);
                    expect(callback).not.toBeCalledWith({ content: commentContentNotToAddTo + commentContentToAdd }, 2, "repo", "project", 10, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Only edits one comment in matching comment thread", function () { return __awaiter(_this, void 0, void 0, function () {
        var threadToEdit, callback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    threadToEdit = makeThread([makeCommentContentOfCorrectForm("build98"), makeCommentContentOfCorrectForm("build99"), makeCommentContentOfCorrectForm("build100")], true);
                    callback = jest.spyOn(mockApi, "updateComment");
                    return [4 /*yield*/, pullRequest.editMatchingCommentInThread(mockApi, threadToEdit, makeCommentContentRow("release897"), "build98")];
                case 1:
                    _a.sent();
                    expect(callback).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Does not edit thread if no comment matches", function () {
        var threadToEdit = makeThread([makeCommentContentOfCorrectForm("build98"), makeCommentContentOfCorrectForm("build99"), makeCommentContentOfCorrectForm("build100")], true);
        var callback = jest.spyOn(mockApi, "updateComment");
        pullRequest.editMatchingCommentInThread(mockApi, threadToEdit, makeCommentContentRow("release897"), "build97");
        expect(callback).toHaveBeenCalledTimes(0);
    });
});
