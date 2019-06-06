"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureBuildInterfaces = __importStar(require("azure-devops-node-api/interfaces/BuildInterfaces"));
var Build_1 = require("../Build");
describe('Build Tests', function () {
    var build;
    var mockBuildData;
    var mockBuildTimeline;
    var failedTask = {
        result: azureBuildInterfaces.TaskResult.Failed,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    };
    var succeededTask = {
        result: azureBuildInterfaces.TaskResult.Succeeded,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    };
    function fillMockBuildData(buildStatus, buildResult) {
        mockBuildData = {
            status: buildStatus,
            result: buildResult
        };
    }
    function fillMockBuildTimeline(buildRecords) {
        mockBuildTimeline = {
            records: buildRecords
        };
    }
    test('Complete failed build is failure', function () {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.Completed, azureBuildInterfaces.BuildResult.Failed);
        fillMockBuildTimeline([failedTask]);
        build = new Build_1.Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(true);
    });
    test('Incomplete failed build is failure', function () {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, failedTask, succeededTask]);
        build = new Build_1.Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(true);
    });
    test('Incomplete build without current failures is not failure', function () {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, succeededTask]);
        build = new Build_1.Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false);
    });
    test('Build with incomplete failed task is not a failure', function () {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        var inProgressTask = {
            result: azureBuildInterfaces.TaskResult.Failed,
            state: azureBuildInterfaces.TimelineRecordState.InProgress
        };
        fillMockBuildTimeline([succeededTask, inProgressTask, succeededTask]);
        build = new Build_1.Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false);
    });
});
