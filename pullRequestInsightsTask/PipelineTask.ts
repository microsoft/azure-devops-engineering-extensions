import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";


export interface IPipelineTask {
    getDuration: () => number;
    getName: () => string;
    equals: (other: IPipelineTask) => boolean;
    isLongRunning: (thresholdTime: number) => boolean;
    ran: () => boolean;
    wasFailure: () => boolean;
}


export class BuildTask implements IPipelineTask {

    constructor(buildTaskRecord: azureBuildInterfaces.TimelineRecord) {

    }

    public getDuration(): number {
        return null; // TODO
    }

    public getName(): string {
        return null; // TODO
    }

    public isLongRunning(thresholdTime: number): boolean {
        return null; // TODO
    }

    public ran(): boolean {
        return null; // TODO
    }

    public wasFailure(): boolean {
        return null; // TODO
    }

    public equals(other: IPipelineTask): boolean {
        return null; // TODO
    }

    private getId(): number {
        return null; // TODO
    }
}