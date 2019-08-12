import { AbstractTestResultsDetailsParser } from "./AbstractTestResultsDetailsParser";
import { TestSummaryItemModel } from "../../model/testresults/TestSummaryItemModel";
import { TestResultsDetailsForGroup, TestResultsDetails, TestResultGroupBy } from "azure-devops-node-api/interfaces/TestInterfaces";
import { InvalidTestResultDataError } from "../../exceptions/InvalidTestResultDataError";

export class TestResultDetailsParserForRun extends AbstractTestResultsDetailsParser {

  constructor(testResultDetails: TestResultsDetails)
  {
    super(testResultDetails);    
    if (testResultDetails.groupByField.toUpperCase() != "TestRun".toUpperCase())
    {
        throw new InvalidTestResultDataError(`Expected test result group type to be Priority. But found ${testResultDetails.groupByField}`);
    }
  }

  public getSummaryItems(): TestSummaryItemModel[] {
    return this.testResultDetails.resultsForGroup.map(r => this.getTestRunSummaryInfo(r));
  }  
  
  public getGroupByValue(group: TestResultsDetailsForGroup): string {
    const runinfo = this.readGroupByValue(group);
    return runinfo.name;
  }

  private getTestRunSummaryInfo(resultsForGroup: TestResultsDetailsForGroup): TestSummaryItemModel
  {
      console.log(`Getting Test summary data for test run - ${resultsForGroup.groupByValue.name}`);
      const runinfo = this.readGroupByValue(resultsForGroup);

      var summaryItem = new TestSummaryItemModel(runinfo.name == null ? runinfo.id.toString() : runinfo.name, runinfo.id.toString());

      this.parseBaseData(resultsForGroup, summaryItem);

      return summaryItem;
  }

  private readGroupByValue(resultsForGroup: TestResultsDetailsForGroup) : TestRunInfo{
    const runinfo = new TestRunInfo();
    runinfo.id = resultsForGroup.groupByValue.id;
    runinfo.name = resultsForGroup.groupByValue.name;
    return runinfo;
  }
}

export class TestRunInfo
{
    public id: number;

    public name: string;
}