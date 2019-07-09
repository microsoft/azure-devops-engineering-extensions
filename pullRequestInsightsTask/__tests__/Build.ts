import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../Build";
import sinon from "sinon";
import { AbstractPipelineTask } from "../AbstractPipelineTask";
import { BuildTask } from "../BuildTask";
import { mock } from "ts-mockito";


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

    function makeFakeTaskForComparision(name: string, id: string): AbstractPipelineTask {
        let fake: AbstractPipelineTask = mock(BuildTask);
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
        fillMockBuildTimeline([makeTimelineRecord(null, null, null, null, "yellow", "a"), makeTimelineRecord(null, null, null, null, "blue", "b"), makeTimelineRecord(null, null, null, null, "red", "c")]);
        build = new Build(null, mockBuildTimeline);
        let expectedTasks: AbstractPipelineTask[] = [new BuildTask("yellow", "a", null, null, null, null), new BuildTask("blue", "b", null, null, null, null), new BuildTask("red", "c", null, null, null, null)];
        expect(build.getTasks()).toEqual(expectedTasks);
    });
    
    test('Null is returned when there are no tasks to be retrieved', () => {
        fillMockBuildTimeline([]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTasks()).toEqual([]);
    });

    test('Equivalent task retrieved from build when present', () => {
        let record: azureBuildInterfaces.TimelineRecord = makeTimelineRecord(azureBuildInterfaces.TaskResult.Failed, null, null, null, "name", "abc");
        let taskToGet: AbstractPipelineTask = new BuildTask("name", "abc", null, null, null, azureBuildInterfaces.TaskResult.Failed);
        expect(taskToGet.equals(makeFakeTaskForComparision("name", "abc"))).toBe(true)
        fillMockBuildTimeline([record, makeTimelineRecord(null, null, null, null, "name1", "efg")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTask(makeFakeTaskForComparision("name", "abc"))).toEqual(taskToGet);
    });

    test('Null returned when task cannot be gotten', () => {
        fillMockBuildTimeline([makeTimelineRecord(null, null, null, null, "name1", "efg")]);
        build = new Build(null, mockBuildTimeline);
        expect(build.getTask(makeFakeTaskForComparision("name", "abc"))).toBeNull();
    });

});