import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import sinon from "sinon";
import { ReleaseTask } from "../ReleaseTask";


describe('ReleaseTask Tests', () => {

   
    let task: ReleaseTask;

    function makeTask(name: string, id: string, duration: number, ran: boolean): ReleaseTask {
        let fake: ReleaseTask = new ReleaseTask({name: name});
        sinon.stub(fake, "getId").returns(id);
        sinon.stub(fake, "getDuration").returns(duration);
        sinon.stub(fake, "ran").returns(ran);
        return fake;
    }

    test("Task failed when it has failure status", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Failed});
        expect(task.wasFailure()).toBe(true);
    });

    test("Task did not fail when it does not have failure status", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Succeeded});
        expect(task.wasFailure()).toBe(false);
    });

    test("Task ran when it failed and has times", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Failed});
        expect(task.ran()).toBe(true);
    });

    test("Task ran when it succeeded and has times", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Succeeded});
        expect(task.ran()).toBe(true);
    });


    test("Task did not run when pending", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Pending});
        expect(task.ran()).toBe(false);
    });

    test("Task did not run when cancelled", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Canceled});
        expect(task.ran()).toBe(false);
    });

     test("Task did not run when it has no start time", () => {
        task = new ReleaseTask({finishTime: new Date("2019-05-24 02:15:55.00"), startTime: null, status: azureReleaseInterfaces.TaskStatus.Succeeded});
        expect(task.ran()).toBe(false);
    });

    test("Task did not run when it has no end time", () => {
        task = new ReleaseTask({finishTime: null, startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Succeeded});
        expect(task.ran()).toBe(false);
    });

    
    test("Task did not run when necessary field is missing", () => {
        task = new ReleaseTask({startTime: new Date("2019-05-23 01:14:40.00"), status: azureReleaseInterfaces.TaskStatus.Succeeded});
        expect(task.ran()).toBe(false);
    });

  


});