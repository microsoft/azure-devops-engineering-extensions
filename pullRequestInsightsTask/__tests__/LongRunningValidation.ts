import { LongRunningValidation } from "../LongRunningValidation";
import { BuildTask } from "../BuildTask";
import { AbstractPipelineTask } from "../AbstractPipelineTask";
import sinon from "sinon";

describe("LongRunningValidation Tests", () => {


    let validation: LongRunningValidation;

    function makeFakeTask(name: string, id: string, duration?: number, agent?: string): AbstractPipelineTask {
        let task = new BuildTask({id: id}, name, null, null, agent, null, null);
        sinon.stub(task, "getDuration").returns(duration);
        return task;
    }
    

    test("Task instance is correctly added to long running validation",  () => {
       let task: AbstractPipelineTask = makeFakeTask("abc", "123", 5);
       validation = new LongRunningValidation("abc", "123", 1);
       expect(validation.getLongestTaskInstanceDuration()).toBe(-Infinity);
       validation.addTaskInstance(task);
       expect(validation.getLongestTaskInstanceDuration()).toBe(task.getDuration());
    });

    test("Task instance that is not instance of same task as validation is not added to long running validation",  () => {
        let task: AbstractPipelineTask = makeFakeTask("cba", "321", 5);
       validation = new LongRunningValidation("abc", "123", 1);
       expect(validation.getLongestTaskInstanceDuration()).toBe(-Infinity);
       validation.addTaskInstance(task);
       expect(validation.getLongestTaskInstanceDuration()).toBe(-Infinity);
    });

    test("Longest duration is correct when there is a single instance",  () => {
       
    });

    test("Shortest duration is correct when there is a single instance",  () => {
       
    });

    test("Longest regression is correct when there is a single instance",  () => {
       
    });

    test("Shortest regression is correct when there is a single instance",  () => {
       
    });

    test("Longest duration is correct when there are multiple instances",  () => {
       
    });

    test("Shortest duration is correct when there are multiple instances",  () => {
       
    });


    test("Longest regression is correct when there are multiple instances",  () => {
       
    });

    test("Shortest regression is correct when there are multiple instances",  () => {
       
    });

    test("Shortest regression is correct when there are multiple instances",  () => {
       
    });



    test("",  () => {
       
    });


    test("",  () => {
       
    });

    test("",  () => {
       
    });

});