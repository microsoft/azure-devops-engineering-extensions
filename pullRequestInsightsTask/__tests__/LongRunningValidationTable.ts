import { Table, FailureTable, LongRunningValidationsTable } from "../Table";
import { IPipeline } from "../IPipeline";
import sinon from "sinon";
import { Release } from "../Release";
import { mock } from "ts-mockito";
import { stringify } from "querystring";
import { Branch } from "../branch";
import { AbstractPipelineTask } from "../AbstractPipelineTask";
import { BuildTask } from "../BuildTask";

describe("LongRunningValidationTable Tests", () => {

    let longRunTable: LongRunningValidationsTable;

    function makeFakePipeline(name: string, link: string, definitionId: number, definitionName: string, longRunningValidations?: Map<string, number>): IPipeline {
        let pipeline: IPipeline = mock(Release);
        sinon.stub(pipeline, "getDisplayName").returns(name);
        sinon.stub(pipeline, "getDefinitionName").returns(definitionName);
        sinon.stub(pipeline, "getLink").returns(link);
        sinon.stub((pipeline as Release), "getDefinitionId").returns(definitionId);
        return pipeline;
     }

     function makeFakeBranch(name: string, mostRecent: IPipeline): Branch {
        let branch: Branch = new Branch(name, null);
        sinon.stub(branch, "getTruncatedName").returns(name);
        sinon.stub(branch, "getMostRecentCompletePipeline").returns(mostRecent);
        return branch;
     }

     function makeFakeTask(name: string, duration: number): AbstractPipelineTask {
        let task: AbstractPipelineTask = new BuildTask(null); 
        sinon.stub(task, "getName").returns(name);
        sinon.stub(task, "getDuration").returns(duration);
        return task;
     }

    test("Header is added to empty table",  () => {
       longRunTable = new LongRunningValidationsTable();
       longRunTable.addHeader("master", 98);
       expect(longRunTable.getCurrentCommentData()).toBe("|Failed Pipeline|Long Running Pipeline/Task|Pipeline/Task Duration|98th Percentile on master|Latest master Run|\n|---|---|---|---|---|<!--longRunningValidationTable-->");
    });

    test("Section is not added to table without header",  () => {
        longRunTable = new LongRunningValidationsTable();
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 7, "defName", null);
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 7, undefined);
        longRunTable.addSection(current, "link", makeFakeBranch("branch", recent), 2, [makeFakeTask("abc", 123)], [120]);
        expect(longRunTable.getCurrentCommentData()).toBe("");
    });

    test("Single task section is added to table with existing data",  () => {
        longRunTable = new LongRunningValidationsTable("|Failed Pipeline|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|<!--longRunningValidationTable-->");
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 7, "defName", null);
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 7, undefined);
        longRunTable.addSection(current, "link", makeFakeBranch("branch", recent), 2, [makeFakeTask("abc", 123)], [120]);
        expect(longRunTable.getCurrentCommentData()).toBe("|Failed Pipeline|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|\n|[defName](pipelineLink)| abc |123 ms|120 ms|[otherPipeline](otherPipelineLink)|<!--longRunningValidationTable-->")
    });

    test("Multi task section is added to table with existing data",  () => {
        longRunTable = new LongRunningValidationsTable("|Failed Pipeline|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|<!--longRunningValidationTable-->");
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 7, "defName", null);
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 7, undefined);
        longRunTable.addSection(current, "link", makeFakeBranch("branch", recent), 2, [makeFakeTask("abc", 123), makeFakeTask("xyz", 321)], [120, 130]);
        expect(longRunTable.getCurrentCommentData()).toBe("|Failed Pipeline|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|\n|[defName](pipelineLink)| abc |123 ms|120 ms|[otherPipeline](otherPipelineLink)|\n| | xyz |321 ms|130 ms| |<!--longRunningValidationTable-->");
    });
    });