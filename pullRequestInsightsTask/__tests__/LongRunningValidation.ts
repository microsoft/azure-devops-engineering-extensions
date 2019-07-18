import { LongRunningValidation } from "../LongRunningValidation";
import { BuildTask } from "../BuildTask";
import { AbstractPipelineTask } from "../AbstractPipelineTask";
import sinon from "sinon";

describe("LongRunningValidation Tests", () => {


    let validation: LongRunningValidation;

    function makeFakeTask(name: string, id: string, duration?: number, regression?: number, agent?: string): AbstractPipelineTask {
        let task = new BuildTask({id: id}, name, null, null, agent, null, null);
        sinon.stub(task, "getDuration").returns(duration);
        sinon.stub(task, "calculateRegression").returns(regression);
        return task;
    }

    function addTasksToValidation(tasksToAdd: AbstractPipelineTask[]) {
        for (let task of tasksToAdd) {
            validation.addTaskInstance(task);
        }
    }
    
    beforeEach(() => { 
        validation = new LongRunningValidation("abc", "123", 1);
    });

    test("Task instance is correctly added to long running validation",  () => {
       expect(validation.getLongestTaskInstanceDuration()).toBe(-Infinity);
       validation.addTaskInstance(makeFakeTask("abc", "123", 5));
       expect(validation.getLongestTaskInstanceDuration()).toBe(5);
    });

    test("Task instance that is not instance of same task as validation is not added to long running validation",  () => {
       expect(validation.getLongestTaskInstanceDuration()).toBe(-Infinity);
       validation.addTaskInstance(makeFakeTask("cba", "321", 5));
       expect(validation.getLongestTaskInstanceDuration()).toBe(-Infinity);
    });

    test("Shortest duration is correct when there is a single instance",  () => {
       validation.addTaskInstance(makeFakeTask("abc", "123", 5));
       expect(validation.getShortestTaskInstanceDuration()).toBe(5);
    });

    test("Longest regression is correct when there is a single instance",  () => {
        validation.addTaskInstance(makeFakeTask("abc", "123", 5, 2));
        expect(validation.getLongestTaskInstanceRegression()).toBe(2);
    });

    test("Shortest regression is correct when there is a single instance",  () => {
        validation.addTaskInstance(makeFakeTask("abc", "123", 5, 2));
        expect(validation.getShortestTaskInstanceRegression()).toBe(2);
    });

    test("Longest duration is correct when there are multiple instances",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", 5), makeFakeTask("abc", "123", 7), makeFakeTask("abc", "123", 6)]);
        expect(validation.getLongestTaskInstanceDuration()).toBe(7);
    });

    test("Shortest duration is correct when there are multiple instances",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", 5), makeFakeTask("abc", "123", 7), makeFakeTask("abc", "123", 6)]);
        expect(validation.getShortestTaskInstanceDuration()).toBe(5);
    });

    test("Longest regression is correct when there are multiple instances",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", 5, 3), makeFakeTask("abc", "123", 7, 5), makeFakeTask("abc", "123", 6, 4)]);
        expect(validation.getLongestTaskInstanceRegression()).toBe(5);
    });

    test("Shortest regression is correct when there are multiple instances",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", 5, 3), makeFakeTask("abc", "123", 7, 5), makeFakeTask("abc", "123", 6, 4)]);
        expect(validation.getShortestTaskInstanceRegression()).toBe(3);
    });

    test("Has instances on multiple agents is false when there are no tasks added",  () => {
        expect(validation.hasInstancesOnMultipleAgents()).toBe(false);
    });

    test("Has instances on multiple agents is false when there are onlu task instances from one agent",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", null, null, "a"), makeFakeTask("abc", "123", null, null, "a")]);
        expect(validation.hasInstancesOnMultipleAgents()).toBe(false);
    });

    test("Has instances on multiple agents is true when there are task instances from multiple agent",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", null, null, "a"), makeFakeTask("abc", "123", null, null, "b"), makeFakeTask("abc", "123", null, null, "c")]);
        expect(validation.hasInstancesOnMultipleAgents()).toBe(true);
    });

    test("Number of agents task ran on is properly calculated",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", null, null, "a"), makeFakeTask("abc", "123", null, null, "b"), makeFakeTask("abc", "123", null, null, "c")]);
        expect(validation.getNumberOfAgentsRunOn()).toBe(3);
    });

    test("Number of agents task ran on is 0 when no instances have been added",  () => {
        expect(validation.getNumberOfAgentsRunOn()).toBe(0);
    });

    test("Has multiple instances of task when there is more than one instance",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", null, null, "a"), makeFakeTask("abc", "123", null, null, "b"), makeFakeTask("abc", "123", null, null, "c")]);
        expect(validation.hasMultipleTaskInstances()).toBe(true);
    });

    test("Has multiple instances of task when there is more than one instance and all ran on same agent",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", null, null, "a"), makeFakeTask("abc", "123", null, null, "a"), makeFakeTask("abc", "123", null, null, "a")]);
        expect(validation.hasMultipleTaskInstances()).toBe(true);
    });

    test("Does not have multiple instances of task when there is one instance",  () => {
        addTasksToValidation([makeFakeTask("abc", "123", null, null, "a")]);
        expect(validation.hasMultipleTaskInstances()).toBe(false);
    });

});