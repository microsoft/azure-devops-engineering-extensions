import { IPipelineTask } from "./IPipelineTask";

export interface IPipeline{
    getDefinitionId: ()=> number;
    getDefinitionName: () => string;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
    getDisplayName: ()=> string;
    getTask: (taskToGet: IPipelineTask) => IPipelineTask;
    getAllTasks: () => IPipelineTask[];
}

