import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../Build";
import { IPipelineTask, BuildTask } from "../PipelineTask";
import sinon from "sinon";
import { TimelineRecordState } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";


describe('Build Tests', () => {

    let build: Build;
    let mockBuildData: azureBuildInterfaces.Build;
    let mockBuildTimeline: azureBuildInterfaces.Timeline;

    const failedTask: azureBuildInterfaces.TimelineRecord = makeTimelineRecord(azureBuildInterfaces.TaskResult.Failed, azureBuildInterfaces.TimelineRecordState.Completed, new Date(), new Date());
    const succeededTask: azureBuildInterfaces.TimelineRecord = makeTimelineRecord(azureBuildInterfaces.TaskResult.Succeeded, azureBuildInterfaces.TimelineRecordState.Completed, new Date(), new Date());

    function makeTimelineRecord(result?: azureBuildInterfaces.TaskResult, state?: azureBuildInterfaces.TimelineRecordState, startTime?: Date, finishTime?: Date, name?: string, id?: string): azureBuildInterfaces.TimelineRecord{
        return {
            result: result,
            state: state,
            startTime: startTime,
            finishTime: finishTime,
            id: id,
            name: name
        }
    }

    function makeFakeTaskForComparision(name: string, id: string): IPipelineTask {
        let fake: IPipelineTask = new BuildTask(null);
        sinon.stub(fake, "getName").returns(name);
        sinon.stub(fake, "getId").returns(id);
        return fake;
    }

    function fillMockBuildData(buildStatus: azureBuildInterfaces.BuildStatus, buildResult?: azureBuildInterfaces.BuildResult){
        mockBuildData = {
            status: buildStatus,
            result: buildResult
        }
    }

    function fillMockBuildTimeline(timelineRecords: azureBuildInterfaces.TimelineRecord[]){
        mockBuildTimeline = {
            records: timelineRecords
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
        fillMockBuildTimeline([succeededTask, makeTimelineRecord(azureBuildInterfaces.TaskResult.Failed, azureBuildInterfaces.TimelineRecordState.InProgress), succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false); 
    });

    test('Tasks are properly retrieved', () => {
        fillMockBuildTimeline([makeTimelineRecord(undefined, undefined, undefined, undefined, "yellow", "a"), makeTimelineRecord(undefined, undefined, undefined, undefined, "blue", "b"), makeTimelineRecord(undefined, undefined, undefined, undefined, "red", "c")]);
        build = new Build(null, mockBuildTimeline);
        let expectedTasks: IPipelineTask[] = [new BuildTask(makeTimelineRecord(undefined, undefined, undefined, undefined, "yellow", "a")), new BuildTask(makeTimelineRecord(undefined, undefined, undefined, undefined, "blue", "b")), new BuildTask(makeTimelineRecord(undefined, undefined, undefined, undefined, "red", "c"))];
        expect(build.getAllTasks()).toEqual(expectedTasks);
    });
    
    test('Null is returned when there are no tasks to be retrieved', () => {
        fillMockBuildTimeline([]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getAllTasks()).toEqual([]);
    });
    
    test('Equivalent task retrieved from build when present', () => {
        let record: azureBuildInterfaces.TimelineRecord = makeTimelineRecord(azureBuildInterfaces.TaskResult.Failed, undefined, undefined, undefined, "name", "abc");
        let taskToGet: IPipelineTask = new BuildTask(record);
        expect(taskToGet.equals(makeFakeTaskForComparision("name", "abc"))).toBe(true)
        fillMockBuildTimeline([record, makeTimelineRecord(undefined, undefined, undefined, undefined, "name1", "efg")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTask(makeFakeTaskForComparision("name", "abc"))).toEqual(taskToGet);
    });

    test('Null returned when task cannot be gotten', () => {
        fillMockBuildTimeline([makeTimelineRecord(undefined, undefined, undefined, undefined, "name1", "efg")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTask(makeFakeTaskForComparision("name", "abc"))).toBeNull();
    });

});