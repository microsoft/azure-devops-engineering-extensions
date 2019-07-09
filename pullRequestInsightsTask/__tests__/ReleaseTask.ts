import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import sinon from "sinon";
import { ReleaseTask } from "../ReleaseTask";
import { mock } from "ts-mockito";


describe('ReleaseTask Tests', () => {

   
    let task: ReleaseTask;

    test("Task failed when it has failure status", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Failed);
        expect(task.wasFailure()).toBe(true);
    });

    test("Task did not fail when it does not have failure status", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Succeeded);
        expect(task.wasFailure()).toBe(false);
    });

    test("Task ran when it failed and has times", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Failed);
        expect(task.ran()).toBe(true);
    });

    test("Task ran when it succeeded and has times", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Succeeded);
        expect(task.ran()).toBe(true);
    });


    test("Task did not run when pending", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Pending);
        expect(task.ran()).toBe(false);
    });

    test("Task did not run when cancelled", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Canceled);
        expect(task.ran()).toBe(false);
    });

     test("Task did not run when it has no start time", () => {
        task = new ReleaseTask(null, null, null, new Date("2019-05-24 02:15:55.00"), azureReleaseInterfaces.TaskStatus.Succeeded);
        expect(task.ran()).toBe(false);
    });

    test("Task did not run when it has no end time", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), null, azureReleaseInterfaces.TaskStatus.Succeeded);
        expect(task.ran()).toBe(false);
    });

    
    test("Task did not run when necessary field is missing", () => {
        task = new ReleaseTask(null, null, new Date("2019-05-23 01:14:40.00"), undefined, azureReleaseInterfaces.TaskStatus.Succeeded); 
        expect(task.ran()).toBe(false);
    });

  


});