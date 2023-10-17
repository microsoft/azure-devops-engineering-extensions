import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { ChangeModel } from "./ChangeModel";
import { PhaseModel } from "./PhaseModel";
import { TestSummaryGroupModel } from "./testresults/TestSummaryGroupModel";
import { TestResultSummary, AggregatedResultsByOutcome, TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultsGroupModel } from "./testresults/TestResultGroupModel";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { isNullOrUndefined } from "util";
import { ArtifactViewModel } from "./viewmodel/ArtifactViewModel";
import { BuildReferenceViewModel } from "./viewmodel/BuildReferenceViewModel";
import { ReleaseViewModel } from "./viewmodel/ReleaseViewModel";

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

  public abstract getPipelineViewModel(config: PipelineConfiguration): BuildReferenceViewModel | ReleaseViewModel;

  public abstract getArtifactViewModels(config: PipelineConfiguration): ArtifactViewModel[];

  public hasFailedTests(includeOthersInTotal: boolean): boolean {
    if (isNullOrUndefined(this.testResultSummary)) {
      return false;
    }

    if (!includeOthersInTotal) {
      return this.getTestCountForOutcome(TestOutcome.Failed) > 0;
    }

    // Others need to be included - Calculate failed as (total - passed)
    const passedCount = this.getTestCountForOutcome(TestOutcome.Passed);
    if (passedCount > 0) {
      return (this.testResultSummary.aggregatedResultsAnalysis.totalTests - passedCount) > 0;
    }

    // If no passed tests, then anything ran should be considered as failed since "other" outcomes need to be considered as failures
    // if no tests ran, then we don't have failed tests 
    return this.testResultSummary.aggregatedResultsAnalysis.totalTests > 0;
  }

  private getTestCountForOutcome(outcome: TestOutcome) : number {
    const resultsByOutcome = this.testResultSummary.aggregatedResultsAnalysis.resultsByOutcome;

      let testsForOutcome = 0;
      if (!isNullOrUndefined(resultsByOutcome) && !isNullOrUndefined(resultsByOutcome[outcome])) {
        testsForOutcome += resultsByOutcome[outcome].count;
      }

      return testsForOutcome;
  }

  public abstract hasCanceledPhases(): boolean;
}