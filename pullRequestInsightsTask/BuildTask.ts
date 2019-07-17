import { AbstractPipelineTask } from "./AbstractPipelineTask";
import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { ITaskReference } from "./ITaskReference";

export class BuildTask extends AbstractPipelineTask {

    private state: azureBuildInterfaces.TimelineRecordState;
    private result: azureBuildInterfaces.TaskResult;

    constructor(taskReference: ITaskReference, name: string, startTime: Date, finishTime: Date, agentName: string, state: azureBuildInterfaces.TimelineRecordState, result: azureBuildInterfaces.TaskResult) {
        super(taskReference, name, startTime, finishTime, agentName);
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