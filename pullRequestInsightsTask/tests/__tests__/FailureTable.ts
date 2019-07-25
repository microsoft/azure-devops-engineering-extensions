import sinon from "sinon";
import { mock } from "ts-mockito";
import { FailureTable } from "../../models/FailureTable";
import { Release } from "../../dataModels/Release";
import { AbstractPipeline } from "../../dataModels/AbstractPipeline";
import { Branch } from "../../dataModels/Branch";
import messages from "../../resources/user_messages.json";

describe("FailureTable Tests", () => {
  let failureTable: FailureTable;

  function makeFakePipeline(
    name: string,
    link: string,
    isFailure: boolean,
    definitionId: number
  ): AbstractPipeline {
    const pipeline: AbstractPipeline = mock(Release);
    sinon.stub(pipeline, "isFailure").returns(isFailure);
    sinon.stub(pipeline, "getDefinitionName").returns(name);
    sinon.stub(pipeline, "getLink").returns(link);
    sinon.stub(pipeline as Release, "getDefinitionId").returns(definitionId);
    return pipeline;
  }

  function makeFakeBranch(
    name: string,
    failureStreak: number,
    isHealthy: boolean
  ): Branch {
    const branch: Branch = new Branch(name, null);
    sinon.stub(branch, "getTruncatedName").returns(name);
    sinon.stub(branch, "getPipelineFailStreak").returns(failureStreak);
    sinon.stub(branch, "isHealthy").returns(isHealthy);
    return branch;
  }

  test("Header is added to comment without table data", () => {
    failureTable = new FailureTable();
    failureTable.addHeader("FakeTarget", null);
    expect(failureTable.getCurrentCommentData()).toBe(
      "\n" + messages.failureCommentTableHeading.format("FakeTarget", null) + "\n|---|---|---|<!--failureTable-->"
    );
  });

  test("Header is not added to table with existing data", () => {
    failureTable = new FailureTable(
      messages.failureCommentTableHeading.format("FakeTarget", null) + "\n|---|---|---|<!--failureTable-->"
    );
    failureTable.addHeader("fakeTarget", null);
    expect(failureTable.getCurrentCommentData()).toBe(
      messages.failureCommentTableHeading.format("FakeTarget", null) + "\n|---|---|---|<!--failureTable-->"
    );
  });

  test("Section is added to table with data", () => {
    failureTable = new FailureTable(
      "|Failed Pipeline|FakeTarget Health|Insights|\n|---|---|---|<!--failureTable-->"
    );
    failureTable.addSection(
      makeFakePipeline("thisBuild", "h", true, null),
      "link",
      makeFakeBranch("thisBranch", 7, true),
      5,
      null
    );
    expect(failureTable.getCurrentCommentData()).toBe(
      "|Failed Pipeline|FakeTarget Health|Insights|\n|---|---|---|\n|[thisBuild](h)| :heavy_check_mark: |" +
      "thisBranch branch is Healthy <br> Failure in this PR is likely related to change|<!--failureTable-->"
    );
  });

  test("Section is not added to empty table without heading", () => {
    failureTable = new FailureTable();
    failureTable.addSection(
      makeFakePipeline("thisBuild", "h", true, null),
      "link",
      makeFakeBranch("thisBranch", 7, false),
      7,
      null
    );
    expect(failureTable.getCurrentCommentData()).toBe("");
  });

  test("Failure row added when branch unhealthy", () => {
    failureTable = new FailureTable(
      "|Failed Pipeline|FakeTarget Health|Insights|\n|---|---|---|<!--failureTable-->"
    );
    failureTable.addSection(
      makeFakePipeline("thisBuild", "h", true, null),
      "link",
      makeFakeBranch("thisBranch", 7, false),
      5,
      null
    );
    expect(failureTable.getCurrentCommentData()).toBe(
      "|Failed Pipeline|FakeTarget Health|Insights|\n|---|---|---|\n|[thisBuild](h)| :x: |" +
      "thisBranch branch is Unhealthy <br> Please compare thisBranch branch [failures](link) <br> with current and take appropriate action|<!--failureTable-->"
    );
  });
});
