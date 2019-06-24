import { FailureTable } from "../Table";
import { Build } from "../Build";
import { IPipeline } from "../IPipeline";
import sinon from "sinon";
import { Branch } from "../branch";
import { Release } from "../Release";
import { mock } from "ts-mockito";


describe("FailureTable Tests", () => {

    let failureTable: FailureTable;

    beforeEach(() =>{
       
    });

    function makeFakePipeline(name: string, link: string, isFailure: boolean, definitionId: number): IPipeline {
       let pipeline: IPipeline = mock(Release);
       sinon.stub(pipeline, "isFailure").returns(isFailure);
       sinon.stub(pipeline, "getDisplayName").returns(name);
       sinon.stub(pipeline, "getLink").returns(link);
       sinon.stub((pipeline as Release), "getDefinitionId").returns(definitionId);
       return pipeline;
    }

        
    function makeFakeBranch(name: string, failureStreak: number): Branch {
        let branch: Branch = new Branch(name, null);
        sinon.stub(branch, "getTruncatedName").returns(name);
        sinon.stub(branch, "getPipelineFailStreak").returns(failureStreak);
        return branch;
     }

    test("Header is added to empty table", () => {
       failureTable = new FailureTable("build");
       failureTable.addHeader("fakeTarget", 76);
       expect(failureTable.getTableAsString()).toBe("|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|");
    });

    test("Header is not added to table with existing data", () => {
        failureTable = new FailureTable("build", "|Name|someBranch History|Latest someBranch Run|\n|---|---|---|");
        console.log(failureTable.tableHasData())
        failureTable.addHeader("fakeTarget", 80);
        expect(failureTable.getTableAsString()).toBe("|Name|someBranch History|Latest someBranch Run|\n|---|---|---|");
     });

    test("Section is added to table with data", () => {
       failureTable = new FailureTable("build", "|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|");
       failureTable.addSection(makeFakePipeline("thisBuild", "h", true, null), makeFakePipeline("otherBuild", "j", true, null), makeFakeBranch("thisBranch", 7), null);
       expect(failureTable.getTableAsString()).toBe("|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|\n|[thisBuild](h)|Failing last 7 thisBranch builds|Latest run from thisBranch: [otherBuild](j)|");
    });

    test("Section is not added to empty table without heading", () => {
        failureTable = new FailureTable("build");
        failureTable.addSection(makeFakePipeline("thisBuild", "h", true, null), makeFakePipeline("otherBuild", "j", true, null), makeFakeBranch("thisBranch", 7), null);
        expect(failureTable.getTableAsString()).toBe("");
     });

    test("Empty table does not have data",  () => {
        failureTable = new FailureTable("build");
        expect(failureTable.tableHasData()).toBe(false);
    });

    test("Table with data has data",  () => {
        failureTable = new FailureTable("build", "|data|");
        expect(failureTable.tableHasData()).toBe(true);
    });

    test("Header properly formatted for release",  () => {
        failureTable = new FailureTable("release");
        failureTable.addHeader("fakeTarget", 80);
        expect(failureTable.getTableAsString()).toBe("|Definition Name|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|---|");
    });

    test("Row properly formatted for release",  () => {
        failureTable = new FailureTable("release", "|Definition Name|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|---|");
        failureTable.addSection(makeFakePipeline("someRelease", "link", true, 5), makeFakePipeline("otherRelease", "otherLink", true, null), makeFakeBranch("thisBranch", 7), null);
        expect(failureTable.getTableAsString()).toBe("|Definition Name|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|---|\n|5|[someRelease](link)|Failing last 7 thisBranch releases|Latest run from thisBranch: [otherRelease](otherLink)|");
    });

    test("Success row added when most recent failed",  () => {
        failureTable = new FailureTable("build", "|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|");
        failureTable.addSection(makeFakePipeline("thisBuild", "h", true, null), makeFakePipeline("otherBuild", "j", false, null), makeFakeBranch("thisBranch", 7), null);
        expect(failureTable.getTableAsString()).toBe("|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|\n|[thisBuild](h)|Last thisBranch build successful|Latest run from thisBranch: [otherBuild](j)|")
    });
});