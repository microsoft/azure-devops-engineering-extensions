import { Build, Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Report } from "./Report";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { BuildReferenceViewModel } from "./viewmodel/BuildReferenceViewModel";
import { PhaseModel } from "./PhaseModel";
import { ChangeModel } from "./ChangeModel";
export declare class BuildReport extends Report {
    private build;
    private timeline;
    private lastCompletedBuild;
    private lastCompletedTimeline;
    setBuildData($build: Build, $timeline: Timeline, $lastCompletedBuild: Build, $lastCompletedTimeline: Timeline, $phases: PhaseModel[], $changes: ChangeModel[]): void;
    hasPrevGotSameFailures(): boolean;
    hasFailedTasks(): boolean;
    hasPrevFailedTasks(): boolean;
    arePrevFailedTasksSame(): boolean;
    getPrevConfig(config: PipelineConfiguration): PipelineConfiguration;
    getEnvironmentStatus(): string;
    getPipelineViewModel(config: PipelineConfiguration): BuildReferenceViewModel;
    getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[];
    hasCanceledPhases(): boolean;
    private timelineHasFailedTasks;
    private getTasksByResultinTimeline;
}
