"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureGitInterfaces = __importStar(require("azure-devops-node-api/interfaces/GitInterfaces"));
var PullRequest_1 = require("../PullRequest");
describe("PullRequest Tests", function () {
    var pullRequest;
    var threads;
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
    test("Does not find a comment id when comments are of wrong format", function () {
        pullRequest = new PullRequest_1.PullRequest(2, "repo", "project");
        threads = [makeThread(["|jk jk hj| failure |", "fake comment"], azureGitInterfaces.CommentThreadStatus.Active, 6)];
        expect(pullRequest.getCurrentIterationCommentId(threads, "thisBuild")).toBeNull;
    });
    test("Finds the correct comment id when comment of same build iteration in correct format exists", function () {
        pullRequest = new PullRequest_1.PullRequest(2, "repo", "project");
        threads = [makeThread(["|jk jk hj| failure |", "fake comment"], azureGitInterfaces.CommentThreadStatus.Active, 6), makeThread(["|Build Iteration: 345| \n |---------| \n |[dgff](dfg) | \n |Failing last fgd fgd dfgs| \n |Latest run from branch: [sdfs](df)|"], azureGitInterfaces.CommentThreadStatus.Active, 5)];
        expect(pullRequest.getCurrentIterationCommentId(threads, "345")).toBe(5);
    });
});
