import { DeploymentJobViewModel } from "./DeploymentJobViewModel";
import { PhaseModel } from "../PhaseModel";
export declare class PhaseViewModelWrapper {
    PhaseViewModel: PhaseViewModel[];
}
export declare class PhaseViewModel {
    DeploymentJob: DeploymentJobViewModel;
    TasksDuration: string;
    Status: string;
    Rank: number;
    Name: string;
    constructor(phase: PhaseModel);
    private InitializeDeploymentJobs;
    private InitializeTasksDuration;
}
