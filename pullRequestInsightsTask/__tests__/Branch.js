"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Build_1 = require("../Build");
var sinon = __importStar(require("sinon"));
var Branch_1 = require("../Branch");
describe('Branch Tests', function () {
    var failedBuildOne;
    var successfulBuildTwo;
    var failedBuildThree;
    var successfulBuildFour;
    var branch;
    beforeEach(function () {
        failedBuildOne = new Build_1.Build(null, null);
        successfulBuildTwo = new Build_1.Build(null, null);
        failedBuildThree = new Build_1.Build(null, null);
        successfulBuildFour = new Build_1.Build(null, null);
        var builds = [failedBuildOne, successfulBuildTwo, failedBuildThree, successfulBuildFour];
        for (var buildNumber = 0; buildNumber < builds.length; buildNumber++) {
            sinon.stub(builds[buildNumber], "getId").returns(buildNumber);
        }
        sinon.stub(failedBuildOne, "isFailure").returns(true);
        sinon.stub(failedBuildThree, "isFailure").returns(true);
        sinon.stub(successfulBuildTwo, "isFailure").returns(false);
        sinon.stub(successfulBuildFour, "isFailure").returns(false);
    });
    test("Counts pipeline failure streak of multiple fails", function () {
        branch = new Branch_1.Branch("", [failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.getPipelineFailStreak()).toEqual(4);
    });
    test("Does not count any pipeline failure streak when first pipeline does not fail", function () {
        branch = new Branch_1.Branch("", [successfulBuildTwo, failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne]);
        expect(branch.getPipelineFailStreak()).toEqual(0);
    });
    test("Does not count any pipeline failure streak when no pipelines fail", function () {
        branch = new Branch_1.Branch("", [successfulBuildTwo, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.getPipelineFailStreak()).toEqual(0);
    });
    test("Gets most recently failed pipeline", function () {
        branch = new Branch_1.Branch("", [failedBuildOne, failedBuildThree, successfulBuildTwo]);
        expect(branch.getMostRecentFailedPipeline()).toEqual(failedBuildOne);
        expect(branch.getMostRecentFailedPipeline()).not.toEqual(failedBuildThree);
    });
    test("Gets most recently failed pipeline when first few succeed", function () {
        branch = new Branch_1.Branch("", [successfulBuildTwo, successfulBuildFour, failedBuildOne]);
        expect(branch.getMostRecentFailedPipeline()).toEqual(failedBuildOne);
    });
    test("Gets no pipeline when no pipelines fail", function () {
        branch = new Branch_1.Branch("", [successfulBuildFour, successfulBuildTwo]);
        expect(branch.getMostRecentFailedPipeline()).toBeNull();
    });
    test("Too many pipelines failed when when failure streak of pipelines is larger than threshold", function () {
        branch = new Branch_1.Branch("", [failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.tooManyPipelinesFailed(2)).toBe(true);
    });
    test("Too many pipelines failed is false when failure streak of pipelines is shorter than threshold", function () {
        branch = new Branch_1.Branch("", [failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.tooManyPipelinesFailed(2)).toBe(true);
    });
});
