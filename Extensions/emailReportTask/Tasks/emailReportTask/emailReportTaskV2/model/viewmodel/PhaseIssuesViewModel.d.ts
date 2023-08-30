import { TaskResultViewModelWrapper } from "./TaskResultViewModel";
import { PhaseModel } from "../PhaseModel";
export declare class PhaseIssuesViewModel {
    Tasks: TaskResultViewModelWrapper;
    Name: string;
    constructor(phases: PhaseModel[]);
}
