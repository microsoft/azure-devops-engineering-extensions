import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../Build";


describe('Build Tests', () => {

    let build: Build;
    let mockBuildData: azureBuildInterfaces.Build;
    let mockBuildTimeline: azureBuildInterfaces.Timeline;

    const failedTask: azureBuildInterfaces.TimelineRecord = makeTask(azureBuildInterfaces.TaskResult.Failed, azureBuildInterfaces.TimelineRecordState.Completed);
    const succeededTask: azureBuildInterfaces.TimelineRecord = makeTask(azureBuildInterfaces.TaskResult.Succeeded, azureBuildInterfaces.TimelineRecordState.Completed);

    function makeTask(result?: azureBuildInterfaces.TaskResult, state?: azureBuildInterfaces.TimelineRecordState, startTime?: Date, finishTime?: Date, id?: string){
        return {
            result: result,
            state: state,
            startTime: startTime,
            finishTime: finishTime,
            id: id
        }
    }

    function fillMockBuildData(buildStatus: azureBuildInterfaces.BuildStatus, buildResult?: azureBuildInterfaces.BuildResult){
        mockBuildData = {
            status: buildStatus,
            result: buildResult
        }
    }

    function fillMockBuildTimeline(buildRecords: azureBuildInterfaces.TimelineRecord[]){
        mockBuildTimeline = {
            records: buildRecords
        }
    }

    test('Complete failed build is failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.Completed, azureBuildInterfaces.BuildResult.Failed);
        fillMockBuildTimeline([failedTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(true); 
    });

    test('Incomplete failed build is failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, failedTask, succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(true); 
    });

    test('Incomplete build without current failures is not failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false); 
    });

    test('Build with incomplete failed task is not a failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, makeTask(azureBuildInterfaces.TaskResult.Failed, azureBuildInterfaces.TimelineRecordState.InProgress), succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false); 
    });

    test('Invalid build task id has null time', () => {
        fillMockBuildTimeline([{id: "abc"}, {id: "jkl"}, {id: "nop"}]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskLength("def")).toBeNull();
    });

    test('Incomplete task id has null time', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.InProgress, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), "abc")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskLength("abc")).toBeNull();
    });

    test('Length of completed task is properly calculated', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), "xyz")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskLength("xyz")).toBe(90075000);
    });
});