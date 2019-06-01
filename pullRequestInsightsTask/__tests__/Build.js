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
describe('Build', function () {
    var build;
    var failedTask = {
        result: azureBuildInterfaces.TaskResult.Failed,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    };
    var succeededTask = {
        result: azureBuildInterfaces.TaskResult.Succeeded,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    };
    test('Complete failed build is failure', function () {
        var mockBuild = {
            result: azureBuildInterfaces.BuildResult.Failed,
            status: azureBuildInterfaces.BuildStatus.Completed,
        };
        var mockTimeLine = {
            records: [failedTask]
        };
        build = new Build_1.Build(mockBuild, mockTimeLine);
        expect(build.isFailure()).toBe(true);
    });
    test('Incomplete failed build is failure', function () {
        var mockBuild = {
            status: azureBuildInterfaces.BuildStatus.InProgress,
        };
        var mockTimeLine = {
            records: [succeededTask, failedTask, succeededTask]
        };
        build = new Build_1.Build(mockBuild, mockTimeLine);
        expect(build.isFailure()).toBe(true);
    });
    test('Incomplete build without current failures is not failure', function () {
        var mockBuild = {
            status: azureBuildInterfaces.BuildStatus.InProgress,
        };
        var mockTimeLine = {
            records: [succeededTask, succeededTask]
        };
        build = new Build_1.Build(mockBuild, mockTimeLine);
        expect(build.isFailure()).toBe(false);
    });
});
