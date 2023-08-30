import { Report } from "./Report";
import { Artifact, Release, ReleaseEnvironment, ReleaseTask } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { ChangeModel } from "./ChangeModel";
import { PhaseModel } from "./PhaseModel";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { ReleaseViewModel } from "./viewmodel/ReleaseViewModel";
export declare class ReleaseReport extends Report {
    private artifacts;
    private release;
    private environment;
    private lastCompletedRelease;
    private lastCompletedEnvironment;
    setReleaseData($release: Release, $environment: ReleaseEnvironment, $lastCompletedRelease: Release, $phases: PhaseModel[], $changes: ChangeModel[], $lastCompletedEnvironment?: ReleaseEnvironment): void;
    /**
     * Getter $artifacts
     * @return {Artifact[]}
     */
    get $artifacts(): Artifact[];
    /**
     * Getter $release
     * @return {Release}
     */
    get $release(): Release;
    /**
     * Getter $environment
     * @return {ReleaseEnvironment}
     */
    get $environment(): ReleaseEnvironment;
    /**
     * Getter $lastCompletedRelease
     * @return {Release}
     */
    get $lastCompletedRelease(): Release;
    /**
   * Getter $lastCompletedEnvironment
   * @return {ReleaseEnvironment}
   */
    get $lastCompletedEnvironment(): ReleaseEnvironment;
    hasPrevGotSameFailures(): boolean;
    hasFailedTasks(): boolean;
    hasPrevFailedTasks(): boolean;
    arePrevFailedTasksSame(): boolean;
    getPrevConfig(config: PipelineConfiguration): PipelineConfiguration;
    getEnvironmentStatus(): string;
    private hasPartiallySucceededTasks;
    hasCanceledPhases(): boolean;
    getPipelineViewModel(config: PipelineConfiguration): ReleaseViewModel;
    getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[];
    getReleaseTasks(source: ReleaseEnvironment): ReleaseTask[];
}
