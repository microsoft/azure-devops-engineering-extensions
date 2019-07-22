import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../../dataModels/Build";

describe("Build Tests", () => {
  let build: Build;
  let mockBuildData: azureBuildInterfaces.Build;
  let mockBuildTimeline: azureBuildInterfaces.Timeline;

  const failedTask: azureBuildInterfaces.TimelineRecord = makeTimelineRecord(
    azureBuildInterfaces.TaskResult.Failed,
    azureBuildInterfaces.TimelineRecordState.Completed,
    new Date(),
    new Date()
  );
  const succeededTask: azureBuildInterfaces.TimelineRecord = makeTimelineRecord(
    azureBuildInterfaces.TaskResult.Succeeded,
    azureBuildInterfaces.TimelineRecordState.Completed,
    new Date(),
    new Date()
  );

  function makeTimelineRecord(
    result?: azureBuildInterfaces.TaskResult,
    state?: azureBuildInterfaces.TimelineRecordState,
    startTime?: Date,
    finishTime?: Date,
    name?: string,
    id?: string,
    type?: string
  ): azureBuildInterfaces.TimelineRecord {
    return {
      result: result,
      state: state,
      startTime: startTime,
      finishTime: finishTime,
      name: name,
      task: { id: id, name: type }
    };
  }

  function fillMockBuildData(
    buildStatus: azureBuildInterfaces.BuildStatus,
    buildResult?: azureBuildInterfaces.BuildResult
  ): void {
    mockBuildData = {
      status: buildStatus,
      result: buildResult
    };
  }

  function fillMockBuildTimeline(
    timelineRecords: azureBuildInterfaces.TimelineRecord[]
  ): void {
    mockBuildTimeline = {
      records: timelineRecords
    };
  }

  test("Complete failed build is failure", () => {
    fillMockBuildData(
      azureBuildInterfaces.BuildStatus.Completed,
      azureBuildInterfaces.BuildResult.Failed
    );
    fillMockBuildTimeline([failedTask]);
    build = new Build(mockBuildData, mockBuildTimeline);
    expect(build.isFailure()).toBe(true);
  });

  test("Incomplete failed build is failure", () => {
    fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
    fillMockBuildTimeline([succeededTask, failedTask, succeededTask]);
    build = new Build(mockBuildData, mockBuildTimeline);
    expect(build.isFailure()).toBe(true);
  });

  test("Incomplete build without current failures is not failure", () => {
    fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
    fillMockBuildTimeline([succeededTask, succeededTask]);
    build = new Build(mockBuildData, mockBuildTimeline);
    expect(build.isFailure()).toBe(false);
  });

  test("Build with incomplete failed task is not a failure", () => {
    fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
    fillMockBuildTimeline([
      succeededTask,
      makeTimelineRecord(
        azureBuildInterfaces.TaskResult.Failed,
        azureBuildInterfaces.TimelineRecordState.InProgress
      ),
      succeededTask
    ]);
    build = new Build(mockBuildData, mockBuildTimeline);
    expect(build.isFailure()).toBe(false);
  });

  test("Null is returned when there are no tasks to be retrieved", () => {
    fillMockBuildTimeline([]);
    build = new Build(null, mockBuildTimeline);
    expect(build.getTasks()).toEqual([]);
  });

  test("Null returned when task cannot be gotten", () => {
    fillMockBuildTimeline([
      makeTimelineRecord(null, null, null, null, "name1", "efg")
    ]);
    build = new Build(null, mockBuildTimeline);
    expect(build.getTask("name", "abc", "type")).toBeNull();
  });
});
