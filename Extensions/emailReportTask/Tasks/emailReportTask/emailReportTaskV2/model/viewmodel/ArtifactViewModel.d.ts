import { Artifact } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
export declare class ArtifactViewModelWrapper {
    ArtifactViewModel: ArtifactViewModel[];
}
export declare class ArtifactViewModel {
    ArtifactDefinitionUrl: string;
    BranchName: string;
    BuildSummaryUrl: string;
    Name: string;
    Version: string;
    IsPrimary: boolean;
    constructor(artifact: Artifact, config: PipelineConfiguration);
    private getArtifactInfo;
}
