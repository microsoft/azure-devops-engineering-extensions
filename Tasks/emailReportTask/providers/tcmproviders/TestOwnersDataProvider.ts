import { IDataProvider } from "../IDataProvider";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { Report } from "../../model/Report";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { ITestResultsClient } from "../restclients/ITestResultsClient";
import { TestOutcome, TestCaseResult } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ReportFactory } from "../../model/ReportFactory";

export class TestOwnersDataProvider implements IDataProvider {

  private testResultsClient: ITestResultsClient;

  constructor(testResultsClient: ITestResultsClient)  {
    this.testResultsClient = testResultsClient;
  }

 public async getReportDataAsync(pipelineConfig: PipelineConfiguration, reportDataConfig: ReportDataConfiguration): Promise<Report> {
    const report = ReportFactory.createNewReport(pipelineConfig);
    const failedTestResultDetails = await this.testResultsClient.getTestResultsDetailsAsync("TestRun", [ TestOutcome.Failed ]);

    const resultsToFetch: TestCaseResult[] = [];
    failedTestResultDetails.resultsForGroup.forEach(r => {
      resultsToFetch.push(...r.results);
    });

    const failedOwners = await this.testResultsClient.getTestResultOwnersAsync(resultsToFetch);
    report.$failedTestOwners.push(...failedOwners);

    console.log("Fetched test owners data");
    return report;
  }
}