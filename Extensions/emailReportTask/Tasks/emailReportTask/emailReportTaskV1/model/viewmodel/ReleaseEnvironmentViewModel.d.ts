import { ReleaseEnvironment } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
export declare class ReleaseEnvironmentViewModel {
    EnvironmentName: string;
    EnvironmentOwnerEmail: string;
    constructor(environment: ReleaseEnvironment);
}
