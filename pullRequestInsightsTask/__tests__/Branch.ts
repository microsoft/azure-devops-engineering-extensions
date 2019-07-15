import { Build } from '../Build';
import * as sinon from 'sinon';
import { Branch } from '../Branch';
import { AbstractPipeline } from '../AbstractPipeline';
import { AbstractPipelineTask } from '../AbstractPipelineTask';
import { BuildTask } from '../BuildTask';
import { mock } from 'ts-mockito';

describe('Branch Tests', () => {
    
    let failedBuildOne: AbstractPipeline;
    let successfulBuildTwo: AbstractPipeline;
    let failedBuildThree: AbstractPipeline;
    let successfulBuildFour: AbstractPipeline;
    let incompleteBuild: AbstractPipeline;
    let branch: Branch;

    beforeEach(() => {
        failedBuildOne = new Build(null, null);
        successfulBuildTwo = new Build(null, null);
        failedBuildThree = new Build(null, null);
        successfulBuildFour = new Build(null, null);
        incompleteBuild = new Build(null, null);

        let builds: AbstractPipeline[] = [failedBuildOne, successfulBuildTwo, failedBuildThree, successfulBuildFour];
        for (let buildNumber = 0; buildNumber < builds.length; buildNumber++){
            sinon.stub(builds[buildNumber], "getId").returns(buildNumber);
            sinon.stub(builds[buildNumber], "isComplete").returns(true);
            sinon.stub(builds[buildNumber], "getDisplayName").returns("");
        }
        sinon.stub(failedBuildOne, "isFailure").returns(true);
        sinon.stub(failedBuildThree, "isFailure").returns(true);
        sinon.stub(successfulBuildTwo, "isFailure").returns(false);
        sinon.stub(successfulBuildFour, "isFailure").returns(false);
        sinon.stub(incompleteBuild, "isComplete").returns(false);
    });

    function makePipeline(isFailure?: boolean, isComplete?: boolean, tasks?: AbstractPipelineTask[]): AbstractPipeline {
        let pipeline: AbstractPipeline = new Build(null, null);
        sinon.stub(pipeline, "isFailure").returns(isFailure);
        sinon.stub(pipeline, "isComplete").returns(isComplete);
        sinon.stub(pipeline, "getTasks").returns(tasks);
        return pipeline;
    }

    function makeTask(name: string, id: string, duration: number): AbstractPipelineTask {
        let fake: AbstractPipelineTask = mock(BuildTask);
        sinon.stub(fake, "getName").returns(name);
        sinon.stub(fake, "getId").returns(id);
        sinon.stub(fake, "getDuration").returns(duration);
        return fake;
    }


    test("Returns capitalized last part of full name as truncated name", ()=> {
        branch = new Branch("refs/head/master");
        expect(branch.getTruncatedName()).toEqual("Master"); 
    });

    test("Returns capitalized whole name truncated name when unseperated ", ()=> {
        branch = new Branch("master");
        expect(branch.getTruncatedName()).toEqual("Master"); 
    });

    test("Counts pipeline failure streak of multiple fails", ()=> {
        branch = new Branch("", [failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.getPipelineFailStreak()).toEqual(4); 
    });

    test("Does not count any pipeline failure streak when first pipeline does not fail", ()=> {
        branch = new Branch("", [successfulBuildTwo, failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne]);
        expect(branch.getPipelineFailStreak()).toEqual(0); 
    });

    test("Does not count any pipeline failure streak when no pipelines fail", ()=> {
        branch = new Branch("", [successfulBuildTwo, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.getPipelineFailStreak()).toEqual(0); 
    });

    test("Gets most recently completed pipeline", ()=> {
        branch = new Branch("", [failedBuildOne, failedBuildThree, successfulBuildTwo]);
        expect(branch.getMostRecentCompletePipeline()).toEqual(failedBuildOne);
        expect(branch.getMostRecentCompletePipeline()).not.toEqual(failedBuildThree);
    });

    test("Gets most recently completed pipeline when first is not finished", ()=> {
        branch = new Branch("", [incompleteBuild, failedBuildOne]);
        expect(branch.getMostRecentCompletePipeline()).toEqual(failedBuildOne);
    });

    test("Gets no pipeline when no pipelines are complete", ()=> {
        branch = new Branch("", [incompleteBuild]);
        expect(branch.getMostRecentCompletePipeline()).toBeNull();
    });

    test("Null return when invalid task id is given", () => {
        branch = new Branch("", [makePipeline(undefined, undefined, []), makePipeline(undefined, undefined, []), makePipeline(undefined, undefined, [])]);
        expect(branch.getPercentileTimeForPipelineTask(70, makeTask("abc", "id", 1))).toBeNull();
    });

    test("Correct percentile is returned when task only ran on some pipelines", () => {
        branch = new Branch("", [makePipeline(undefined, undefined, [makeTask("abc", "id", 16)]), makePipeline(undefined, undefined, [makeTask("abc", "id", null)]), makePipeline(undefined, undefined,  [makeTask("abc", "id", 4)]), makePipeline(undefined, undefined,  [makeTask("abc", "id", 20)]), makePipeline(undefined, undefined,  [makeTask("abc", "id", 3)])]);
        expect(branch.getPercentileTimeForPipelineTask(75, makeTask("abc", "id", null))).toBeCloseTo(18);
    });

    test("Correct percentile is returned for a valid task when percentile falls on exact length", () => {
        branch = new Branch("", [makePipeline(undefined, undefined, [makeTask("jkl", "id", 4)]), makePipeline(undefined, undefined, [makeTask("jkl", "id", 2)]), makePipeline(undefined, undefined, [makeTask("jkl", "id", 3)]), makePipeline(undefined, undefined, [makeTask("jkl", "id", 1)])]);
        expect(branch.getPercentileTimeForPipelineTask(62.5, makeTask("jkl", "id", 4))).toBeCloseTo(3);
    });

    test("Correct percentile is returned for a valid task when percentile does not fall on exact length", () => {
        branch = new Branch("", [makePipeline(undefined, undefined, [makeTask("jkl", "id", 4)]), makePipeline(undefined, undefined, [makeTask("jkl", "id", 2)]), makePipeline(undefined, undefined, [makeTask("jkl", "id", 3)]), makePipeline(undefined, undefined, [makeTask("jkl", "id", 1)])]);
        expect(branch.getPercentileTimeForPipelineTask(40, makeTask("jkl", "id", 4))).toBeCloseTo(2.1);
    });

    test("Branch with failed pipelines within number to check is not healthy", () => { 
        branch = new Branch("", [successfulBuildTwo, failedBuildOne, successfulBuildTwo, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.isHealthy(3)).toBe(false);

    });

    test("Branch with no failed pipelines is healthy", () => { 
        branch = new Branch("", [successfulBuildTwo, successfulBuildTwo, successfulBuildTwo, successfulBuildTwo]);
        expect(branch.isHealthy(3)).toBe(true);
    });

    test("Branch with failed pipelines only outside of number to check is healthy", () => { 
        branch = new Branch("", [successfulBuildTwo, successfulBuildTwo, failedBuildOne, failedBuildOne]);
        expect(branch.isHealthy(2)).toBe(true);
    });

    test("Branch given number to check that is higher than number of pipelines checks all pipelines for health", () => { 
        branch = new Branch("", [successfulBuildTwo, successfulBuildTwo, failedBuildOne]);
        expect(branch.isHealthy(7)).toBe(false);
    });
})