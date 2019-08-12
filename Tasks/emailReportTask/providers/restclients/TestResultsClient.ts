import { AbstractClient } from "./AbstractClient";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { ITestApi } from "azure-devops-node-api/TestApi";
import { TestResultsDetails, TestResultSummary, TestOutcome, TestResultsQuery, TestCaseResult, ResultsFilter, WorkItemReference } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ITestResultsClient } from "./ITestResultsClient";
import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

export class TestResultsClient extends AbstractClient implements ITestResultsClient {

  private readonly MaxItemsSupported : number = 100;
  private testApiPromise : Promise<ITestApi>;

  constructor(pipelineConfig: PipelineConfiguration) {
    super(pipelineConfig);
    this.testApiPromise = this.connection.getTestApi();
  }

  public async queryTestResultBugs(automatedTestName: string, resultId: number): Promise<WorkItemReference[]> {
    return await (await this.testApiPromise).queryTestResultWorkItems(
      this.pipelineConfig.$projectName,
      "Microsoft.BugCategory",
      automatedTestName,
      resultId
    );
  }

  public async getTestResultById(testRunId: number, resultId: number): Promise<TestCaseResult> {
    const result = await (await this.testApiPromise).getTestResultById(
      this.pipelineConfig.$projectName,
      testRunId,
      resultId
    );
    return result;
  }

  public async queryTestResultsReportAsync(): Promise<void> {
    await (await this.testApiPromise).queryTestResultsReportForRelease(
      this.pipelineConfig.$projectName,
      this.pipelineConfig.$pipelineId,
      this.pipelineConfig.$environmentId);
  }

  public async getTestResultOwnersAsync(resultsToFetch: TestCaseResult[]): Promise<IdentityRef[]> {
    var query = new TestResultsQueryImpl();
    query.fields = [ "Owner" ];

    const tasks: Promise<TestResultsQuery>[] = [];
    const testApi = await this.testApiPromise;
    for (let i=0,j = resultsToFetch.length; i<j; i+= this.MaxItemsSupported) {
      const tempArray = resultsToFetch.slice(i,i + this.MaxItemsSupported);
      query.results = tempArray;
      tasks.push(testApi.getTestResultsByQuery(query, this.pipelineConfig.$projectName));
    }

    await Promise.all(tasks);

    const results: TestCaseResult[] = [];
    tasks.forEach(async t => results.push(...(await t).results));

    const ownerMap = new Map<string, IdentityRef>();
    results.forEach(r => {
      if(this.isValid(r.owner)) {
        const key = this.getUniqueName(r.owner);
        if(!ownerMap.has(key)) {
          ownerMap.set(key, r.owner);
        }
      }
    });

    return Object.values(ownerMap.values);
  }

  public async getTestResultsDetailsAsync(groupBy: string, outcomeFilters?: TestOutcome[]) : Promise<TestResultsDetails> {
    const filter = this.getOutcomeFilter(outcomeFilters);
    return await (await this.testApiPromise).getTestResultDetailsForRelease(
      this.pipelineConfig.$projectName,
      this.pipelineConfig.$pipelineId,
      this.pipelineConfig.$environmentId,
      null,
      groupBy,
      filter);
  }

  public async getTestResultSummaryAsync(includeFailures: boolean) : Promise<TestResultSummary>
  {
      return await (await this.testApiPromise).queryTestResultsReportForRelease(
        this.pipelineConfig.$projectName,
        this.pipelineConfig.$pipelineId,
        this.pipelineConfig.$environmentId,
        null,
        includeFailures);
  }

  private getOutcomeFilter(outcomes: TestOutcome[]): string
  {
    let filter: string = null;
    if(outcomes != null && outcomes.length > 0) {
      const outComeString = Array.from(new Set(outcomes.map(o => Number(o)))).join(",");
      filter = `Outcome eq ${outComeString}`;
    }
    return filter;
  }

  private getUniqueName(identity: IdentityRef): string
  {
      return identity.uniqueName == null ? identity.displayName : identity.uniqueName;
  }

  private isValid(identity: IdentityRef): boolean
  {
      return identity != null && ( identity.displayName != null || identity.uniqueName != null);

  }
}

export class TestResultsQueryImpl implements TestResultsQuery {
  public fields: string[];
  public results: TestCaseResult[];
  public resultsFilter: ResultsFilter;
}