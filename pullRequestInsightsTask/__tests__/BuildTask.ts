import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IPipelineTask, BuildTask } from "../PipelineTask";
import sinon from "sinon";
import { TimelineRecordState } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";


describe('BuildTask Tests', () => {

   
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

    function makeFakeTaskForComparision(name: string, id: string): IPipelineTask {
        let fake: IPipelineTask = new BuildTask(null);
        sinon.stub(fake, "getName").returns(name);
        sinon.stub(fake, "getId").returns(id);
        return fake;
    }

    test("", () => {
       
    });

    test("", () => {
       
    });

    test("", () => {
       
    });
    test("", () => {
       
    });
    test("", () => {
       
    });
    test("", () => {
       
    });
    test("", () => {
       
    });
    test("", () => {
       
    });
    test("", () => {
       
    });


});