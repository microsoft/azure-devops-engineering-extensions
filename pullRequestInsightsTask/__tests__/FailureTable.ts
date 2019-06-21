import { FailureTable } from "../Table";
import { Build } from "../Build";
import { IPipeline } from "../IPipeline";
import sinon from "sinon";
import { Branch } from "../branch";


describe("FailureTable Tests", () => {

    let failureTable: FailureTable;

    beforeEach(() =>{
       
    });

    function makeFakePipeline(name: string, link: string, isFailure: boolean, longRunningValidations?: Map<string, number>): IPipeline {
       let pipeline: IPipeline = new Build(null, null);
       sinon.stub(pipeline, "isFailure").returns(isFailure);
       sinon.stub(pipeline, "getDisplayName").returns(name);
       sinon.stub(pipeline, "getLink").returns(link);
       //sinon.stub(pipeline, "getLongRunningValidations").returns(longRunningValidations);
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
       failureTable.addSection(makeFakePipeline("thisBuild", "h", true), makeFakePipeline("otherBuild", "j", true), makeFakeBranch("thisBranch", 7), "build", null);
       expect(failureTable.getTableAsString()).toBe("|Name|fakeTarget History|Latest fakeTarget Run|\n|---|---|---|\n|[thisBuild](h)|Failing last 7 thisBranch builds|Latest run from thisBranch: [otherBuild](j)|");
    });

    test("Section is not added to empty table without heading", () => {
        failureTable = new FailureTable("build");
        failureTable.addSection(makeFakePipeline("thisBuild", "h", true), makeFakePipeline("otherBuild", "j", true), makeFakeBranch("thisBranch", 7), "build", null);
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
       
    });

    test("Failure row added when most recent failed",  () => {
       
    });

    test("Success row added when most recent did not fail",  () => {
       
    });
});