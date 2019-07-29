import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { ReleaseTaskRun } from "../../dataModels/ReleaseTaskRun";

describe("ReleaseTaskRun Tests", () => {
  let task: ReleaseTaskRun;

  test("Task failed when it has failure status", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Failed
    );
    expect(task.wasFailure()).toBe(true);
  });

  test("Task did not fail when it does not have failure status", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Succeeded
    );
    expect(task.wasFailure()).toBe(false);
  });

  test("Task ran when it failed and has times", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Failed
    );
    expect(task.ran()).toBe(true);
  });

  test("Task ran when it succeeded and has times", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Succeeded
    );
    expect(task.ran()).toBe(true);
  });

  test("Task did not run when pending", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Pending
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when cancelled", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Canceled
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when it has no start time", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      null,
      new Date("2019-05-24 02:15:55.00"),
      null,
      azureReleaseInterfaces.TaskStatus.Succeeded
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when it has no end time", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      null,
      null,
      azureReleaseInterfaces.TaskStatus.Succeeded
    );
    expect(task.ran()).toBe(false);
  });

  test("Task did not run when necessary field is missing", () => {
    task = new ReleaseTaskRun(
      null,
      null,
      new Date("2019-05-23 01:14:40.00"),
      undefined,
      null,
      azureReleaseInterfaces.TaskStatus.Succeeded
    );
    expect(task.ran()).toBe(false);
  });
});
