import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import sinon from "sinon";
import { BuildTaskRun } from "../../dataModels/BuildTaskRun";
import { AbstractPipelineTaskRun } from "../../dataModels/AbstractPipelineTaskRun";

describe("BuildTaskRun Tests", () => {
  let task: AbstractPipelineTaskRun;

  function setTaskDuration(task: AbstractPipelineTaskRun, duration: number) {
    sinon.stub(task, "getDuration").returns(duration);
    sinon.stub(task, "ran").returns(true);
  }

  test("Task failed when it has failure status", () => {
    task = new BuildTaskRun(
      null,
      "",
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureBuildInterfaces.TimelineRecordState.Completed,
      azureBuildInterfaces.TaskResult.Failed
    );
    expect(task.wasFailure()).toBe(true);
  });
  test("Task did not fail when it does not have failure status", () => {
    task = new BuildTaskRun(
      null,
      "",
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureBuildInterfaces.TimelineRecordState.Completed,
      azureBuildInterfaces.TaskResult.Succeeded
    );
    expect(task.wasFailure()).toBe(false);
  });

  test("Correct duration is calculated", () => {
    task = new BuildTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      null,
      null
    );
    sinon.stub(task, "ran").returns(true);
    expect(task.getDuration()).toBe(90075000);
  });

  test("Null is returned for duration when task did not run", () => {
    task = new BuildTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      null,
      null
    );
    sinon.stub(task, "ran").returns(false);
    expect(task.getDuration()).toBeNull();
  });

  test("Task is long running when ran took longer than threshold time", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, 100);
    expect(task.isLongRunning(90, 1, 1)).toBe(true);
  });

  test("Task is not long running when not complete", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, 10);
    expect(task.isLongRunning(90, 1, 1)).toBe(false);
  });

  test("Task is not long running when no threshold time is given", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, 10);
    expect(task.isLongRunning(null, 1, 1)).toBe(false);
  });

  test("Task is not long running when minimum regression is not reached", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, 10);
    expect(task.isLongRunning(9, 1, 2)).toBe(false);
  });

  test("Task is not long running when minimum duration is not reached", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, 10);
    expect(task.isLongRunning(2, 11, 1)).toBe(false);
  });

  test("Task ran when it is complete and has times", () => {
    task = new BuildTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureBuildInterfaces.TimelineRecordState.Completed,
      null
    );
    expect(task.ran()).toBe(true);
  });

  test("Task did not run when incomplete", () => {
    task = new BuildTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureBuildInterfaces.TimelineRecordState.InProgress,
      null
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when it has no start time", () => {
    task = new BuildTaskRun(
      null,
      null,
      null,
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureBuildInterfaces.TimelineRecordState.Completed,
      null
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when it has no end time", () => {
    task = new BuildTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      null,
      null,
      azureBuildInterfaces.TimelineRecordState.Completed,
      null
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when necessary field is missing", () => {
    task = new BuildTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      null,
      null,
      azureBuildInterfaces.TimelineRecordState.Completed,
      null
    );
    expect(task.ran()).toBe(false);
  });

  test("Regression is correctly calculated", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, 10);
    expect(task.calculateRegression(9)).toBe(1);
  });

  test("Regression is negative if task does not have valid duration", () => {
    task = new BuildTaskRun(null, "abc", null, null, null, null, null);
    setTaskDuration(task, null);
    expect(task.calculateRegression(9)).toBe(-9);
  });
});
