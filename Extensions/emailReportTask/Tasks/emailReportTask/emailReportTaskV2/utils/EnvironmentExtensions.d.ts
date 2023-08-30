import { ReleaseDeployPhase, ReleaseEnvironment } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
export declare class EnvironmentExtensions {
    static getPhases(environment: ReleaseEnvironment): Array<ReleaseDeployPhase>;
}
