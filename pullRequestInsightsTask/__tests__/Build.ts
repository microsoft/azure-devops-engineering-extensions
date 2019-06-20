import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../Build";
import { stringify } from "querystring";


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

    test('Cancelled task id has null time', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, null, null)]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskLength("abc")).toBeNull();
    });

    test('Length of completed task is properly calculated', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), "xyz")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskLength("xyz")).toBe(90075000);
    });

    test('Task ids are properly retrieved', () => {
        fillMockBuildTimeline([makeTask(undefined, undefined, undefined, undefined, "yellow"), makeTask(undefined, undefined, undefined, undefined, "blue"), makeTask(undefined, undefined, undefined, undefined, "red")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskIds()).toEqual(["yellow", "blue", "red"]);
    });
    
    test('Null is returned when there are no task ids to be retrieved', () => {
        fillMockBuildTimeline([]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTaskIds()).toEqual([]);
    });

    test('No long running tasks retrieved without matching threshold times', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), "abc")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getLongRunningValidations(new Map<string, number>([["def", 3]]))).toEqual(new Map<string, number>());
    });

    test('All tasks returned when all are long running', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-24 01:15:00.00"), new Date("2019-05-24 01:15:00.05"), "abc"), makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-24 01:15:00.05"), new Date("2019-05-24 01:15:00.15"), "hijk")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getLongRunningValidations(new Map<string, number>([["abc", 48], ["hijk", 70]]))).toEqual(new Map<string, number>([["abc", 50], ["hijk", 100]]));
    });
    
    test('Tasks properly filtered when only some are long running', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-24 01:15:00.00"), new Date("2019-05-24 01:15:00.05"), "abc"), makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-24 01:15:00.05"), new Date("2019-05-24 01:15:00.15"), "hijk")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getLongRunningValidations(new Map<string, number>([["abc", 2], ["hijk", 500]]))).toEqual(new Map<string, number>([["abc", 50]]));
    });

    test('Task with same length as threshold is not long running', () => {
        fillMockBuildTimeline([makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-24 01:15:00.00"), new Date("2019-05-24 01:15:00.05"), "abc"), makeTask(undefined, azureBuildInterfaces.TimelineRecordState.Completed, new Date("2019-05-24 01:15:00.05"), new Date("2019-05-24 01:15:00.15"), "hijk")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getLongRunningValidations(new Map<string, number>([["abc", 50]]))).toEqual(new Map<string, number>());
    });

});