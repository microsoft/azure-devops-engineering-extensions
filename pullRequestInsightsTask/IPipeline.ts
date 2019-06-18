export interface IPipeline{
    getDefinitionId: ()=> number;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
    getDisplayName: ()=> string;
    getTaskLength(taskId: string): number | null;
    getLongRunningValidations(taskThresholdTimes: Map<string, number>): Map<string, number>
    getTaskIds: () => string[]
}

