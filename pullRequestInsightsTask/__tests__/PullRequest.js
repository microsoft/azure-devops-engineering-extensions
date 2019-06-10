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
    function makeThread(commentsContents, threadStatus, threadId) {
        var threadComments = [];
        for (var _i = 0, commentsContents_1 = commentsContents; _i < commentsContents_1.length; _i++) {
            var commentContent = commentsContents_1[_i];
            threadComments.push({ content: commentContent });
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
    function makeCommentContentOfCorrectForm(buildIteration) {
        return user_messages_json_1.default.failureCommentHeading.format(buildIteration) + user_messages_json_1.default.failureCommentRow.format("fake", "fake", "fake", "fake", "fake", "fake", "fake", "fake");
    }
    beforeEach(function () {
        pullRequest = new PullRequest_1.PullRequest(2, "repo", "project");
        mockApi = ts_mockito_1.mock(ReleaseAzureApi_1.ReleaseAzureApi);
    });
    test("Does not find a comment thread when comments are of wrong format", function () {
        setThreads([makeThread(["|jk jk hj| failure |", "fake comment"]), makeThread(["|jk jk hj| failure |", "fake comment"])]);
        expect(pullRequest.getCurrentIterationCommentThread(mockApi, "thisBuild")).toBeNull;
    });
    test("Finds comment thread when comment of same build iteration in correct format exists", function () { return __awaiter(_this, void 0, void 0, function () {
        var expectedThread, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    expectedThread = makeThread([makeCommentContentOfCorrectForm("345")], 5);
                    setThreads([makeThread(["|jk jk hj| failure |", "fake comment"]), expectedThread]);
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
                    expectedThread = makeThread([makeCommentContentOfCorrectForm("400")], 7);
                    setThreads([makeThread(["fake comment"]), makeThread([makeCommentContentOfCorrectForm("345")], 5), expectedThread]);
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
        var expectedThread = makeThread([commentContent]);
        var callback = sinon_1.default.spy(mockApi, "postNewCommentThread");
        pullRequest.addNewComment(mockApi, commentContent);
        expect(callback.calledWith(expectedThread, 2, "repo", "project"));
    });
    test("Only calls to deactivate comments that do not match current build iteration", function () {
        var threadsToDeactivate = [makeThread([makeCommentContentOfCorrectForm("90")], azureGitInterfaces.CommentThreadStatus.Active, 6), makeThread([makeCommentContentOfCorrectForm("800")], azureGitInterfaces.CommentThreadStatus.Active, 8)];
        var threadNotToDeactivate = [makeThread([makeCommentContentOfCorrectForm("750")], azureGitInterfaces.CommentThreadStatus.Active, 5)];
        var callback = sinon_1.default.spy(mockApi, "updateCommentThread");
        sinon_1.default.stub(mockApi, "getCommentThreads").resolves(threadNotToDeactivate.concat(threadsToDeactivate));
        pullRequest.deactivateOldComments(mockApi, 5);
        for (var _i = 0, threadsToDeactivate_1 = threadsToDeactivate; _i < threadsToDeactivate_1.length; _i++) {
            var thread = threadsToDeactivate_1[_i];
            expect(callback.calledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id));
        }
        expect(callback.neverCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", threadNotToDeactivate[0].id));
    });
    test("Only calls to deactivate comments that are active or undefined", function () {
        var threadsToDeactivate = [makeThread([makeCommentContentOfCorrectForm("90")], azureGitInterfaces.CommentThreadStatus.Active, 6), makeThread([makeCommentContentOfCorrectForm("800")], undefined, 8)];
        var threadsNotToDeactivate = [makeThread([makeCommentContentOfCorrectForm("750")], azureGitInterfaces.CommentThreadStatus.Active, 10), makeThread([makeCommentContentOfCorrectForm("750")], azureGitInterfaces.CommentThreadStatus.WontFix, 9)];
        var callback = sinon_1.default.spy(mockApi, "updateCommentThread");
        sinon_1.default.stub(mockApi, "getCommentThreads").resolves(threadsNotToDeactivate.concat(threadsToDeactivate));
        pullRequest.deactivateOldComments(mockApi, 5);
        for (var _i = 0, threadsToDeactivate_2 = threadsToDeactivate; _i < threadsToDeactivate_2.length; _i++) {
            var thread = threadsToDeactivate_2[_i];
            expect(callback.calledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id));
        }
        for (var _a = 0, threadsNotToDeactivate_1 = threadsNotToDeactivate; _a < threadsNotToDeactivate_1.length; _a++) {
            var thread = threadsNotToDeactivate_1[_a];
            expect(callback.neverCalledWith({ status: azureGitInterfaces.CommentThreadStatus.Closed }, 2, "repo", "project", thread.id));
        }
    });
    test("Calls to edit matching comment in matching thread", function () {
        expect(5).toEqual(6);
    });
    test("Only edits one comment in matching comment thread", function () {
        expect(5).toEqual(6);
    });
    test("Content for updated comment includes correct information", function () {
        expect(5).toEqual(6);
    });
    test("Comment not from service is not edited", function () {
        expect(5).toEqual(6);
    });
});
