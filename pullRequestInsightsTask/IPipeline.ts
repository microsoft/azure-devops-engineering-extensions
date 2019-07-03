import { IPipelineTask } from "./AbstractPipelineTask";
import { AbstractAzureApi } from "./AbstractAzureApi";

export interface IPipeline{
    getDefinitionId: ()=> number;
    getDefinitionName: () => string;
    getDefinitionLink: (apiCaller: AbstractAzureApi, project: string) => Promise<string>;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
    getDisplayName: ()=> string;
    getTask: (taskToGet: IPipelineTask) => IPipelineTask;
    getAllTasks: () => IPipelineTask[];
}

