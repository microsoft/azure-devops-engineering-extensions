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
    var failedTask = makeTask(azureBuildInterfaces.TaskResult.Failed, azureBuildInterfaces.TimelineRecordState.Completed);
    var succeededTask = makeTask(azureBuildInterfaces.TaskResult.Succeeded, azureBuildInterfaces.TimelineRecordState.Completed);
    function makeTask(result, state, startTime, finishTime, id) {
        return {
            result: result,
            state: state,
            startTime: startTime,
            finishTime: finishTime,
            id: id
        };
    }
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
        fillMockBuildTimeline([succeededTask, makeTask(azureBuildInterfaces.TaskResult.Failed, azureBuildInterfaces.TimelineRecordState.InProgress), succeededTask]);
        build = new Build_1.Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false);
    });
    test('Invalid build task id has null time', function () {
        fillMockBuildTimeline([{ id: "abc" }, { id: "jkl" }, { id: "nop" }]);
        build = new Build_1.Build(null, mockBuildTimeline);
        expect(build.getTaskLength("def")).toBeNull();
    });
    test('Incomplete task id has null time', function () {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.InProgress, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), "abc")]);
        build = new Build_1.Build(null, mockBuildTimeline);
        expect(build.getTaskLength("abc")).toBeNull();
    });
    test('Length of completed task is properly calculated', function () {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), "xyz")]);
        build = new Build_1.Build(null, mockBuildTimeline);
        expect(build.getTaskLength("xyz")).toBe(90075000);
    });
});
