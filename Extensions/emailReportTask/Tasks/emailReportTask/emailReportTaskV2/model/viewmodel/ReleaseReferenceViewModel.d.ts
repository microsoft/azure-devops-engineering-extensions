import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ReleaseReference } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
export declare class ReleaseReferenceViewModel {
    Id: number;
    Name: string;
    Url: string;
    constructor(config: PipelineConfiguration, releaseReference: ReleaseReference);
}
