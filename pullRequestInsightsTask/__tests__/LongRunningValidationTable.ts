import { Table, FailureTable, LongRunningValidationsTable } from "../Table";
import { IPipeline } from "../IPipeline";
import sinon from "sinon";
import { Release } from "../Release";
import { mock } from "ts-mockito";
import { stringify } from "querystring";
import { Branch } from "../branch";

describe("LongRunningValidationTable Tests", () => {

    let longRunTable: LongRunningValidationsTable;

    function makeFakePipeline(name: string, link: string, definitionId: number, longRunningValidations?: Map<string, number>): IPipeline {
        let pipeline: IPipeline = mock(Release);
        sinon.stub(pipeline, "getDisplayName").returns(name);
        sinon.stub(pipeline, "getLink").returns(link);
        sinon.stub((pipeline as Release), "getDefinitionId").returns(definitionId);
        sinon.stub(pipeline, "getLongRunningValidations").returns(longRunningValidations);
        return pipeline;
     }

     function makeFakeBranch(name: string): Branch {
        let branch: Branch = new Branch(name, null);
        sinon.stub(branch, "getTruncatedName").returns(name);
        return branch;
     }

    test("Header is added to empty table",  () => {
       longRunTable = new LongRunningValidationsTable("build");
       longRunTable.addHeader("master", 98);
       expect(longRunTable.getTableAsString()).toBe("|Name|Long Running Pipeline/Task|Pipeline/Task Duration|98th Percentile on master|Latest master Run|\n|---|---|---|---|---|");
    });

    test("Section is not added to table without header",  () => {
        longRunTable = new LongRunningValidationsTable("build");
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 7, new Map<string, number>([["taskOne", 2000]]));
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 7, undefined);
        longRunTable.addSection(current, recent, makeFakeBranch("branch"), new Map<string, number>([["taskOne", 1000]]));
        expect(longRunTable.getTableAsString()).toBe("");
    });

    test("Single task section is added to table with existing data",  () => {
        longRunTable = new LongRunningValidationsTable("build", "|Name|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|");
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 7, new Map<string, number>([["taskOne", 2000]]));
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 7, undefined);
        longRunTable.addSection(current, recent, makeFakeBranch("branch"), new Map<string, number>([["taskOne", 1000]]));
        expect(longRunTable.getTableAsString()).toBe("|Name|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|\n|pipeline|taskOne|2000 ms|1000 ms|[otherPipeline](otherPipelineLink)|")
    });

    test("Multi task section is added to table with existing data",  () => {
        longRunTable = new LongRunningValidationsTable("build", "|Name|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|");
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 7, new Map<string, number>([["taskA", 7000], ["taskB", 8000]]));
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 7, undefined);
        longRunTable.addSection(current, recent, makeFakeBranch("branch"), new Map<string, number>([["taskA", 5000], ["taskB", 6000]]));
        expect(longRunTable.getTableAsString()).toBe("|Name|Long Running Pipeline/Task|Pipeline/Task Duration|95th Percentile on master|Latest master Run|\n|---|---|---|---|---|\n|pipeline|taskA|7000 ms|5000 ms|[otherPipeline](otherPipelineLink)|\n||taskB|8000 ms|6000 ms||");
    });

    test("Header properly formatted for release",  () => {
        longRunTable = new LongRunningValidationsTable("release");
        longRunTable.addHeader("fakeTarget", 80);
        expect(longRunTable.getTableAsString()).toBe("|Definition Name|Name|Long Running Pipeline/Task|Pipeline/Task Duration|80th Percentile on fakeTarget|Latest fakeTarget Run|\n|---|---|---|---|---|---|");
    });

    test("Row properly formatted for release",  () => {
        longRunTable = new LongRunningValidationsTable("release", "|Definition Name|Name|Long Running Pipeline/Task|Pipeline/Task Duration|80th Percentile on master|Latest master Run|\n|---|---|---|---|---|---|");
        let current: IPipeline = makeFakePipeline("pipeline", "pipelineLink", 5, new Map<string, number>([["taskA", 7000], ["taskB", 8000]]));
        let recent: IPipeline = makeFakePipeline("otherPipeline", "otherPipelineLink", 5, undefined);
        longRunTable.addSection(current, recent, makeFakeBranch("thisBranch"), new Map<string, number>([["taskA", 5000], ["taskB", 6000]]));
        expect(longRunTable.getTableAsString()).toBe("|Definition Name|Name|Long Running Pipeline/Task|Pipeline/Task Duration|80th Percentile on master|Latest master Run|\n|---|---|---|---|---|---|\n|5|pipeline|taskA|7000 ms|5000 ms|[otherPipeline](otherPipelineLink)|\n||taskB|8000 ms|6000 ms||");
    });
    });