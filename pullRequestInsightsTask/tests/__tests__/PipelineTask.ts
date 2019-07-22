import { PipelineTask } from "../../dataModels/PipelineTask";
import { BuildTaskRun } from "../../dataModels/BuildTaskRun";
import sinon from "sinon";
import { AbstractPipelineTaskRun } from "../../dataModels/AbstractPipelineTaskRun";

describe("PipelineTask Tests", () => {
  let task: PipelineTask;

  function makeFakeTaskRun(
    name: string,
    id: string,
    type: string,
    duration?: number,
    regression?: number,
    agent?: string,
    isLongRunning?: boolean,
    failed?: boolean,
    ran?: boolean
  ): AbstractPipelineTaskRun {
    let run = new BuildTaskRun({ id: id }, name, null, null, agent, null, null);
    sinon.stub(run, "getDuration").returns(duration);
    sinon.stub(run, "calculateRegression").returns(regression);
    sinon.stub(run, "getType").returns(type);
    sinon.stub(run, "isLongRunning").returns(isLongRunning);
    sinon.stub(run, "wasFailure").returns(failed);
    sinon.stub(run, "ran").returns(ran);
    return run;
  }

  function addTasksToValidation(runsToAdd: AbstractPipelineTaskRun[]) {
    for (let run of runsToAdd) {
      task.addTaskInstance(run);
    }
  }

  beforeEach(() => {
    task = new PipelineTask("abc", "123", "type");
  });

  test("Task is matching when it has same id, name, type", () => {
    expect(task.isMatchingTask("abc", "123", "type")).toBe(true);
  });

  test("Task is not matching when id is different", () => {
    expect(task.isMatchingTask("abc", "13", "type")).toBe(false);
  });

  test("Task is not matching when name is different", () => {
    expect(task.isMatchingTask("ac", "123", "type")).toBe(false);
  });

  test("Task is not matching when type is different", () => {
    expect(task.isMatchingTask("abc", "123", "gt")).toBe(false);
  });

  test("Task instance is correctly added", () => {
    expect(task.getAllDurations()).toEqual([]);
    let run = makeFakeTaskRun("abc", "123", "type", 5, null, null, true);
    task.addTaskInstance(run);
    expect(task.getAllDurations()).toEqual([5]);
  });

  test("Task instance that is not instance of same task as validation is not added to long running validation", () => {
    expect(task.getLongestRegressiveDuration()).toBe(-Infinity);
    task.addTaskInstance(makeFakeTaskRun("cba", "321", "type", 5));
    expect(task.getLongestRegressiveDuration()).toBe(-Infinity);
  });

  test("Shortest duration is correct when there is a single instance", () => {
    task.addTaskInstance(
      makeFakeTaskRun("abc", "123", "type", 5, null, null, true)
    );
    expect(task.getShortestRegressiveDuration()).toBe(5);
  });

  test("Longest regression is correct when there is a single instance", () => {
    task.addTaskInstance(
      makeFakeTaskRun("abc", "123", "type", 5, 2, null, true)
    );
    expect(task.getLongestRegression()).toBe(2);
  });

  test("Shortest regression is correct when there is a single instance", () => {
    task.addTaskInstance(
      makeFakeTaskRun("abc", "123", "type", 5, 2, null, true)
    );
    expect(task.getShortestRegression()).toBe(2);
  });

  test("Longest duration is correct when there are multiple instances", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", 5, null, null, true),
      makeFakeTaskRun("abc", "123", "type", 7, null, null, true),
      makeFakeTaskRun("abc", "123", "type", 6, null, null, true)
    ]);
    expect(task.getLongestRegressiveDuration()).toBe(7);
  });

  test("Shortest duration is correct when there are multiple instances", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", 5, null, null, true),
      makeFakeTaskRun("abc", "123", "type", 7, null, null, true),
      makeFakeTaskRun("abc", "123", "type", 6, null, null, true)
    ]);
    expect(task.getShortestRegressiveDuration()).toBe(5);
  });

  test("Longest regression is correct when there are multiple instances", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", 5, 3, null, true),
      makeFakeTaskRun("abc", "123", "type", 7, 5, null, true),
      makeFakeTaskRun("abc", "123", "type", 6, 4, null, true)
    ]);
    expect(task.getLongestRegression()).toBe(5);
  });

  test("Shortest regression is correct when there are multiple instances", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", 5, 3, null, true),
      makeFakeTaskRun("abc", "123", "type", 7, 5, null, true),
      makeFakeTaskRun("abc", "123", "type", 6, 4, null, true)
    ]);
    expect(task.getShortestRegression()).toBe(3);
  });

  test("Regressive extremes only consider long running instances", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", 5, 3, null, false),
      makeFakeTaskRun("abc", "123", "type", 7, 5, null, true),
      makeFakeTaskRun("abc", "123", "type", 6, 4, null, false)
    ]);
    expect(task.getShortestRegression()).toBe(5);
    expect(task.getShortestRegressiveDuration()).toBe(7);
    expect(task.getLongestRegression()).toBe(5);
    expect(task.getLongestRegressiveDuration()).toBe(7);
  });

  test("Number of agents task ran on is properly calculated", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", null, null, "a"),
      makeFakeTaskRun("abc", "123", "type", null, null, "b"),
      makeFakeTaskRun("abc", "123", "type", null, null, "c")
    ]);
    expect(task.getNumberOfAgentsRunOn()).toBe(3);
  });

  test("Number of agents task ran on and regressed on is 0 when no instances have been added", () => {
    expect(task.getNumberOfAgentsRunOn()).toBe(0);
    expect(task.getNumberOfAgentsRegressedOn()).toBe(0);
  });

  test("Number of agents task regressed on is properly calculated", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", null, null, "a", true),
      makeFakeTaskRun("abc", "123", "type", null, null, "b", true),
      makeFakeTaskRun("abc", "123", "type", null, null, "c", true)
    ]);
    expect(task.getNumberOfAgentsRegressedOn()).toBe(3);
  });

  test("Number of agents task regressed on is 0 when all instances are not long running", () => {
    addTasksToValidation([
      makeFakeTaskRun("abc", "123", "type", null, null, "a", false),
      makeFakeTaskRun("abc", "123", "type", null, null, "b", false),
      makeFakeTaskRun("abc", "123", "type", null, null, "c", false)
    ]);
    expect(task.getNumberOfAgentsRegressedOn()).toBe(0);
  });

  test("Task has run that failed when it is present", () => {
    addTasksToValidation([
      makeFakeTaskRun(
        "abc",
        "123",
        "type",
        null,
        null,
        "a",
        false,
        false,
        false
      ),
      makeFakeTaskRun("abc", "123", "type", null, null, "b", false, true, true),
      makeFakeTaskRun("abc", "123", "type", null, null, "c", false, false, true)
    ]);
    expect(task.hasFailedInstance()).toBe(true);
  });

  test("Task does not have run that failed when no runs finished", () => {
    addTasksToValidation([
      makeFakeTaskRun(
        "abc",
        "123",
        "type",
        null,
        null,
        "a",
        false,
        true,
        false
      ),
      makeFakeTaskRun(
        "abc",
        "123",
        "type",
        null,
        null,
        "b",
        false,
        true,
        false
      ),
      makeFakeTaskRun("abc", "123", "type", null, null, "c", false, true, false)
    ]);
    expect(task.hasFailedInstance()).toBe(false);
  });

  test("Task does not have run that failed when no runs are failures", () => {
    addTasksToValidation([
      makeFakeTaskRun(
        "abc",
        "123",
        "type",
        null,
        null,
        "a",
        false,
        false,
        true
      ),
      makeFakeTaskRun(
        "abc",
        "123",
        "type",
        null,
        null,
        "b",
        false,
        false,
        true
      ),
      makeFakeTaskRun("abc", "123", "type", null, null, "c", false, false, true)
    ]);
    expect(task.hasFailedInstance()).toBe(false);
  });
});
