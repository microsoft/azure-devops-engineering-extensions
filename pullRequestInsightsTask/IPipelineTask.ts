import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";


export interface IPipelineTask {
    getDuration: () => number;
    getName: () => string;
    getId: () => string;
    equals: (other: IPipelineTask) => boolean;
    isLongRunning: (thresholdTime: number) => boolean;
    ran: () => boolean;
    wasFailure: () => boolean;
}
