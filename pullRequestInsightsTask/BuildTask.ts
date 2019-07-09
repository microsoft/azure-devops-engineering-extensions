import { AbstractPipelineTask } from "./AbstractPipelineTask";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";

export class BuildTask extends AbstractPipelineTask {

    private state: azureBuildInterfaces.TimelineRecordState;
    private result: azureBuildInterfaces.TaskResult;


    constructor(name: string, id: string, startTime: Date, finishTime: Date, state: azureBuildInterfaces.TimelineRecordState, result: azureBuildInterfaces.TaskResult) {
        super(name, id, startTime, finishTime);
        this.state = state;
        this.result = result;
    }
   
    protected hasCompleteStatus(): boolean {
        return this.state === azureBuildInterfaces.TimelineRecordState.Completed;
    }

    public wasFailure(): boolean {
        return this.result === azureBuildInterfaces.TaskResult.Failed;
    }

}