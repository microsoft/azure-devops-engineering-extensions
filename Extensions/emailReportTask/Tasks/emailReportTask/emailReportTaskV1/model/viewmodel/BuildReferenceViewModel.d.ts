import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { BuildReference, Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
export declare class BuildReferenceViewModel {
    Id: string;
    Number: string;
    Branch: string;
    Url: string;
    DefinitionUrl: string;
    DefinitionName: string;
    constructor(config: PipelineConfiguration, buildReference: BuildReference, build: Build);
}
