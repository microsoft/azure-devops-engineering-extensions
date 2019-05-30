import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import tl = require('azure-pipelines-task-lib/task');

export interface IPipeline{
    // loadData: ()=> void;
   // hasFailed: ()=> boolean; 
    getDefinitionId: ()=> number;
    isFailure: ()=> boolean;
    isComplete: ()=> boolean;
    getLink: ()=> string;
    getId: ()=> number;
}

