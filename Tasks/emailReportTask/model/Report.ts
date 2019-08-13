import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { ChangeModel } from "./ChangeModel";
import { PhaseModel } from "./PhaseModel";
import { TestSummaryGroupModel } from "./testresults/TestSummaryGroupModel";
import { TestResultSummary, AggregatedResultsByOutcome, TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultsGroupModel } from "./testresults/TestResultGroupModel";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { isNullOrUndefined } from "util";
import { ReleaseViewModel } from "./viewmodel/ReleaseViewModel";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { PipelineViewModel } from "./viewmodel/PipelineViewModel";

export abstract class Report {
  private dataMissing: boolean = false;

  private sendMailConditionSatisfied: boolean = false;

  public createdBy: IdentityRef;

  protected associatedChanges: ChangeModel[] = [];

  protected phases: PhaseModel[] = [];

  private failedTestOwners: IdentityRef[] = [];

  public filteredResults: TestResultsGroupModel[] = [];

  public hasFilteredTests: boolean = false;

  private testSummaryGroups: TestSummaryGroupModel[] = [];

  public testResultSummary: TestResultSummary;

  /**
   * Getter $dataMissing
   * @return {boolean}
   */
  public get $dataMissing(): boolean {
    return this.dataMissing;
  }

  /**
 * Getter $associatedChanges
 * @return {ChangeModel[]}
 */
  public get $associatedChanges(): ChangeModel[] {
    return this.associatedChanges;
  }

  /**
* Getter $associatedChanges
* @return {ChangeModel[]}
*/
  public get $phases(): PhaseModel[] {
    return this.phases;
  }

  /**
   * Getter $sendMailConditionSatisfied
   * @return {boolean}
   */
  public get $sendMailConditionSatisfied(): boolean {
    return this.sendMailConditionSatisfied;
  }

  /**
   * Setter $dataMissing
   * @param {boolean} value
   */
  public set $dataMissing(value: boolean) {
    this.dataMissing = value;
  }

  /**
   * Setter $sendMailConditionSatisfied
   * @param {boolean} value
   */
  public set $sendMailConditionSatisfied(value: boolean) {
    this.sendMailConditionSatisfied = value;
  }

  /**
   * Getter $testSummaryGroups
   * @return {TestSummaryGroupModel[]}
   */
  public get $testSummaryGroups(): TestSummaryGroupModel[] {
    return this.testSummaryGroups;
  }


  /**
   * Getter $failedTestOwners
   * @return {IdentityRef[] }
   */
  public get $failedTestOwners(): IdentityRef[] {
    return this.failedTestOwners;
  }

  public abstract hasPrevGotSameFailures(): boolean;

  public abstract hasFailedTasks(): boolean;

  public abstract hasPrevFailedTasks(): boolean;

  public abstract arePrevFailedTasksSame(): boolean;

  public abstract getPrevConfig(config: PipelineConfiguration): PipelineConfiguration;

  public abstract getEnvironmentStatus(): string;

  public abstract getPipelineViewModel(config: PipelineConfiguration): PipelineViewModel;

  public abstract getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[];

  hasFailedTests(includeOthersInTotal: boolean): boolean {
    if (this.testResultSummary == null) {
      return false;
    }

    let passedTests = 0;
    const resultsByOutcomeFalse: AggregatedResultsByOutcome = (this.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome as any).false;
    const resultsByOutcomeTrue: AggregatedResultsByOutcome = (this.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome as any).true;

    if (!includeOthersInTotal) {
      let failedTests = 0;
      if (!isNullOrUndefined(resultsByOutcomeFalse) && resultsByOutcomeFalse.outcome == TestOutcome.Failed) {
        failedTests += resultsByOutcomeFalse.count;
      }

      if (!isNullOrUndefined(resultsByOutcomeTrue) && resultsByOutcomeTrue.outcome == TestOutcome.Failed) {
        failedTests += resultsByOutcomeTrue.count;
      }
      return failedTests > 0;
    }

    if (!isNullOrUndefined(resultsByOutcomeFalse) && resultsByOutcomeFalse.outcome == TestOutcome.Failed) {
      passedTests += resultsByOutcomeFalse.count;
    }

    if (!isNullOrUndefined(resultsByOutcomeTrue) && resultsByOutcomeTrue.outcome == TestOutcome.Failed) {
      passedTests += resultsByOutcomeTrue.count;
    }

    if (passedTests > 0) {
      return this.testResultSummary.aggregatedResultsAnalysis.totalTests - passedTests > 0;
    }

    return this.testResultSummary.aggregatedResultsAnalysis.totalTests > 0;
  }

  public abstract hasCanceledPhases(): boolean;
}