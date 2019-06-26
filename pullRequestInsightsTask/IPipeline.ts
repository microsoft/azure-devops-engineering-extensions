import { IPipelineTask } from "./PipelineTask";

export interface IPipeline{
    getDefinitionId: ()=> number;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
    getDisplayName: ()=> string;
   // getTaskLength: (taskId: string) => number | null;
   // getLongRunningValidations: (taskThresholdTimes: number[]) => IPipelineTask[]
    // getTaskIds: () => string[]
    getTask: (taskToGet: IPipelineTask) => IPipelineTask;
    getAllTasks: () => IPipelineTask[];
}

