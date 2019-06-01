export interface IPipeline{
    // loadData: ()=> void;
   // hasFailed: ()=> boolean; 
    getDefinitionId: ()=> number;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
}

