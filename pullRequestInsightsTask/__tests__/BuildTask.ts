import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IPipelineTask, BuildTask } from "../PipelineTask";
import sinon from "sinon";
import { TimelineRecordState } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";


describe('BuildTask Tests', () => {

   
    let task: BuildTask;

    function makeTask(name: string, id: string, duration: number, ran: boolean): BuildTask {
        let fake: BuildTask = new BuildTask(null);
        sinon.stub(fake, "getName").returns(name);
        sinon.stub(fake, "getId").returns(id);
        sinon.stub(fake, "getDuration").returns(duration);
        sinon.stub(fake, "ran").returns(ran);
        return fake;
    }

    test("Correct duration is calculated", () => {
        task = new BuildTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00")});
        sinon.stub(task, "ran").returns(true);
        expect(task.getDuration()).toBe(90075000);
    });

    test("Null is returned for duration when task did not run", () => {
        task = new BuildTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00")});
        sinon.stub(task, "ran").returns(false);
        expect(task.getDuration()).toBeNull();
    });

    test("Task is long running when ran took longer than threshold time", () => {
       task = makeTask("", "", 100, true);
       expect(task.isLongRunning(90)).toBe(true);
    });

    test("Task is not long running when not complete", () => {
        task = makeTask("", "", 100, false);
        expect(task.isLongRunning(90)).toBe(true);
    });

    test("Task is not long running when no threshold time is given", () => {
        task = makeTask("", "", 100, true);
       expect(task.isLongRunning(null)).toBe(false);
    });

    test("Task ran when it is complete and has times", () => {
        task = new BuildTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), state: azureBuildInterfaces.TimelineRecordState.Completed});
        expect(task.ran()).toBe(true);
    });

    test("Task did not run when incomplete", () => {
        task = new BuildTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), state: azureBuildInterfaces.TimelineRecordState.InProgress});
        expect(task.ran()).toBe(false);
    });

     test("Task did not run when it has no start time", () => {
        task = new BuildTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: null, state: azureBuildInterfaces.TimelineRecordState.Completed});
        expect(task.ran()).toBe(false);
    });

    test("Task did not run when it has no end time", () => {
        task = new BuildTask({finishTime: null, startTime: new Date("2019-05-23 01:14:40.00"), state: azureBuildInterfaces.TimelineRecordState.Completed});
        expect(task.ran()).toBe(false);
    });

    
    test("Task did not run when necessary field is missing", () => {
        task = new BuildTask({startTime: new Date("2019-05-23 01:14:40.00"), state: azureBuildInterfaces.TimelineRecordState.Completed});
        expect(task.ran()).toBe(false);
    });

    test("Tasks are equal when they have same id and name", () => {
       task = makeTask("abc", "123", 6, true);
       expect(task.equals(makeTask("abc", "123", 7, false))).toBe(true);
    });

    test("Tasks are not equal when ids are different", () => {
        task = makeTask("abc", "13", null, null);
        expect(task.equals(makeTask("abc", "123", null, null))).toBe(false);
    });

    test("Tasks are not equal when names are different", () => {
        task = makeTask("ab", "123", 6, true);
        expect(task.equals(makeTask("abc", "123", null, null))).toBe(false);
    });


});