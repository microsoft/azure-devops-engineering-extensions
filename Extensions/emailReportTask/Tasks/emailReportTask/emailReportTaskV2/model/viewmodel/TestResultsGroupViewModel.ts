import { TestResultViewModel, TestResultViewModelWrapper } from "./TestResultViewModel";
import { ReportConfiguration } from "../../config/ReportConfiguration";
import { TestResultsGroupModel } from "../testresults/TestResultGroupModel";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { DisplayNameHelper } from "../../utils/DisplayNameHelper";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { TestResultModel } from "../testresults/TestResultModel";
import { TcmHelper } from "../../providers/tcmproviders/TcmHelper";

export class TestResultsGroupViewModelWrapper {
  public TestResultsGroupViewModel: TestResultsGroupViewModel[];
}

export class TestResultsGroupViewModel {
  public FailedTests: TestResultViewModelWrapper = new TestResultViewModelWrapper();
  public GroupName: string;
  public OtherTests: TestResultViewModelWrapper = new TestResultViewModelWrapper();
  public PassedTests: TestResultViewModelWrapper = new TestResultViewModelWrapper();

  constructor(resultsGroupModel: TestResultsGroupModel, reportConfig: ReportConfiguration) {
    this.setGroupName(resultsGroupModel, reportConfig);
    this.FailedTests.TestResultViewModel = this.getTestResultViewModels(resultsGroupModel, reportConfig.$pipelineConfiguration, [TestOutcome.Failed]);
    this.PassedTests.TestResultViewModel = this.getTestResultViewModels(resultsGroupModel, reportConfig.$pipelineConfiguration, [TestOutcome.Passed]);
    this.OtherTests.TestResultViewModel = this.getTestResultViewModels(resultsGroupModel, reportConfig.$pipelineConfiguration,
      TcmHelper.exceptOutcomes([TestOutcome.Failed, TestOutcome.Passed]));
  }

  private setGroupName(resultsGroupModel: TestResultsGroupModel, reportConfig: ReportConfiguration): void {
    var groupTestResultsBy = reportConfig.$reportDataConfiguration.$testResultsConfig.$groupTestResultsBy;
    this.GroupName = groupTestResultsBy == GroupTestResultsBy.Priority ?
      DisplayNameHelper.getPriorityDisplayName(resultsGroupModel.groupName) :
      resultsGroupModel.groupName;
  }

  private getTestResultViewModels(
    resultsGroupModel: TestResultsGroupModel,
    config: PipelineConfiguration,
    testOutcomes: TestOutcome[]): TestResultViewModel[] {
    return this.getTestResultsByOutcomes(resultsGroupModel, testOutcomes)
      .map(result => new TestResultViewModel(result, config));
  }

  public getTestResultsByOutcomes(
    source: TestResultsGroupModel,
    outcomes: TestOutcome[]): TestResultModel[] {
    const testResults: TestResultModel[] = [];

    outcomes.forEach(outcome => {
      if (source.testResults.has(outcome)) {
        testResults.push(...source.testResults.get(outcome));
      }
    });
    return testResults;
  }
}