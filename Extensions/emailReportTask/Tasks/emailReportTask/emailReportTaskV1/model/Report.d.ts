import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { ChangeModel } from "./ChangeModel";
import { PhaseModel } from "./PhaseModel";
import { TestSummaryGroupModel } from "./testresults/TestSummaryGroupModel";
import { TestResultSummary } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultsGroupModel } from "./testresults/TestResultGroupModel";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { BuildReferenceViewModel } from "./viewmodel/BuildReferenceViewModel";
import { ReleaseViewModel } from "./viewmodel/ReleaseViewModel";
export declare abstract class Report {
    private dataMissing;
    private sendMailConditionSatisfied;
    createdBy: IdentityRef;
    protected associatedChanges: ChangeModel[];
    protected phases: PhaseModel[];
    private failedTestOwners;
    filteredResults: TestResultsGroupModel[];
    hasFilteredTests: boolean;
    private testSummaryGroups;
    testResultSummary: TestResultSummary;
    /**
     * Getter $dataMissing
     * @return {boolean}
     */
    get $dataMissing(): boolean;
    /**
   * Getter $associatedChanges
   * @return {ChangeModel[]}
   */
    get $associatedChanges(): ChangeModel[];
    /**
  * Getter $associatedChanges
  * @return {ChangeModel[]}
  */
    get $phases(): PhaseModel[];
    /**
     * Getter $sendMailConditionSatisfied
     * @return {boolean}
     */
    get $sendMailConditionSatisfied(): boolean;
    /**
     * Setter $dataMissing
     * @param {boolean} value
     */
    set $dataMissing(value: boolean);
    /**
     * Setter $sendMailConditionSatisfied
     * @param {boolean} value
     */
    set $sendMailConditionSatisfied(value: boolean);
    /**
     * Getter $testSummaryGroups
     * @return {TestSummaryGroupModel[]}
     */
    get $testSummaryGroups(): TestSummaryGroupModel[];
    /**
     * Getter $failedTestOwners
     * @return {IdentityRef[] }
     */
    get $failedTestOwners(): IdentityRef[];
    abstract hasPrevGotSameFailures(): boolean;
    abstract hasFailedTasks(): boolean;
    abstract hasPrevFailedTasks(): boolean;
    abstract arePrevFailedTasksSame(): boolean;
    abstract getPrevConfig(config: PipelineConfiguration): PipelineConfiguration;
    abstract getEnvironmentStatus(): string;
    abstract getPipelineViewModel(config: PipelineConfiguration): BuildReferenceViewModel | ReleaseViewModel;
    abstract getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[];
    hasFailedTests(includeOthersInTotal: boolean): boolean;
    private getTestCountForOutcome;
    abstract hasCanceledPhases(): boolean;
}
