import { Build } from '../Build';
import * as sinon from 'sinon';
import { Branch } from '../Branch';
import { IPipeline } from '../IPipeline';
import { stringify } from 'querystring';

describe('Branch Tests', () => {
    
    let failedBuildOne: IPipeline;
    let successfulBuildTwo: IPipeline;
    let failedBuildThree: IPipeline;
    let successfulBuildFour: IPipeline;
    let incompleteBuild: IPipeline;
    let branch: Branch;
    let taskLengthFake: sinon.SinonStub;

    beforeEach(() => {
        failedBuildOne = new Build(null, null);
        successfulBuildTwo = new Build(null, null);
        failedBuildThree = new Build(null, null);
        successfulBuildFour = new Build(null, null);
        incompleteBuild = new Build(null, null);

        let builds: IPipeline[] = [failedBuildOne, successfulBuildTwo, failedBuildThree, successfulBuildFour];
        for (let buildNumber = 0; buildNumber < builds.length; buildNumber++){
            sinon.stub(builds[buildNumber], "getId").returns(buildNumber);
            sinon.stub(builds[buildNumber], "isComplete").returns(true);
        }
        sinon.stub(failedBuildOne, "isFailure").returns(true);
        sinon.stub(failedBuildThree, "isFailure").returns(true);
        sinon.stub(successfulBuildTwo, "isFailure").returns(false);
        sinon.stub(successfulBuildFour, "isFailure").returns(false);
        sinon.stub(incompleteBuild, "isComplete").returns(false);
    });

    // function makePipeline(isFailure?: boolean, isComplete?: boolean, taskLengths?: Map<String, number>): IPipeline {
    //     let pipeline: IPipeline = new Build(null, null);
    //     sinon.stub(pipeline, "isFailure").returns(isFailure);
    //     sinon.stub(pipeline, "isComplete").returns(isComplete);
    //     taskLengthFake = sinon.stub()
    //     let taskIds: string[] = [];
    //     if (taskLengths) {
    //         taskLengths.forEach((value: number, key: string) => {
    //             taskLengthFake.withArgs(key).returns(value);
    //             taskIds.push(key);
    //         });
    //     }
    //     sinon.stub(pipeline, "getTaskLength").callsFake(taskLengthFake);
    //     sinon.stub(pipeline, "getTaskIds").returns(taskIds);
    //     return pipeline;
    // }

    // test("Counts pipeline failure streak of multiple fails", ()=> {
    //     branch = new Branch("", [failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne, successfulBuildTwo, successfulBuildTwo]);
    //     expect(branch.getPipelineFailStreak()).toEqual(4); 
    // });

    // test("Does not count any pipeline failure streak when first pipeline does not fail", ()=> {
    //     branch = new Branch("", [successfulBuildTwo, failedBuildOne, failedBuildOne, failedBuildOne, failedBuildOne]);
    //     expect(branch.getPipelineFailStreak()).toEqual(0); 
    // });

    // test("Does not count any pipeline failure streak when no pipelines fail", ()=> {
    //     branch = new Branch("", [successfulBuildTwo, successfulBuildTwo, successfulBuildTwo]);
    //     expect(branch.getPipelineFailStreak()).toEqual(0); 
    // });

    // test("Gets most recently completed pipeline", ()=> {
    //     branch = new Branch("", [failedBuildOne, failedBuildThree, successfulBuildTwo]);
    //     expect(branch.getMostRecentCompletePipeline()).toEqual(failedBuildOne);
    //     expect(branch.getMostRecentCompletePipeline()).not.toEqual(failedBuildThree);
    // });

    // test("Gets most recently completed pipeline when first is not finished", ()=> {
    //     branch = new Branch("", [incompleteBuild, failedBuildOne]);
    //     expect(branch.getMostRecentCompletePipeline()).toEqual(failedBuildOne);
    // });

    // test("Gets no pipeline when no pipelines are complete", ()=> {
    //     branch = new Branch("", [incompleteBuild]);
    //     expect(branch.getMostRecentCompletePipeline()).toBeNull();
    // });

    // test("Null return when invalid task id is given", () => {
    //     branch = new Branch("", [makePipeline(undefined, undefined, null), makePipeline(undefined, undefined, null), makePipeline(undefined, undefined, null)]);
    //     expect(branch.getPercentileTimesForPipelineTasks(70, ["abc"])).toEqual(new Map<string, number>([["abc", null]]));
    // });

    // test("Correct percentile is returned when task only ran on some pipelines", () => {
    //     branch = new Branch("", [makePipeline(undefined, undefined, new Map([["abc", 16]])), makePipeline(undefined, undefined, new Map([["abc", null]])), makePipeline(undefined, undefined,  new Map([["abc", 4]])), makePipeline(undefined, undefined,  new Map([["abc", 20]])), makePipeline(undefined, undefined,  new Map([["abc", 3]]))]);
    //     expect(branch.getPercentileTimesForPipelineTasks(75, ["abc"])).toEqual(new Map([["abc", 18]]));
    // });

    // test("Correct percentile is returned for a valid task when percentile falls on exact length", () => {
    //     branch = new Branch("", [makePipeline(undefined, undefined, new Map([["jkl", 4]])), makePipeline(undefined, undefined, new Map([["jkl", 2]])), makePipeline(undefined, undefined, new Map([["jkl", 3]])), makePipeline(undefined, undefined, new Map([["jkl", 1]]))]);
    //     expect(branch.getPercentileTimesForPipelineTasks(62.5, ["jkl"])).toEqual(new Map([["jkl", 3]]));
    // });

    // test("Correct percentile is returned for a valid task when percentile does not fall on exact length", () => {
    //     branch = new Branch("", [makePipeline(undefined, undefined, new Map([["jkl", 4]])), makePipeline(undefined, undefined, new Map([["jkl", 2]])), makePipeline(undefined, undefined, new Map([["jkl", 3]])), makePipeline(undefined, undefined, new Map([["jkl", 1]]))]);
    //     expect(branch.getPercentileTimesForPipelineTasks(40, ["jkl"])).toEqual(new Map([["jkl", 2.1]]));
    // });

    // test("Correct percentiles returned for multiple valid tasks when percentile does not fall on exact length", () => {
    //     branch = new Branch("", [makePipeline(undefined, undefined, new Map([["jkl", 4], ["abc", 5]])), makePipeline(undefined, undefined, new Map([["jkl", 2], ["abc", 25]])), makePipeline(undefined, undefined, new Map([["jkl", 3], ["abc", 10]])), makePipeline(undefined, undefined, new Map([["jkl", 1], ["abc", 30]]))]);
    //     let percentiles: Map<string, number> = branch.getPercentileTimesForPipelineTasks(40, ["jkl", "abc"]);
    //     expect(percentiles.get("jkl")).toBeCloseTo(2.1);
    //     expect(percentiles.get("abc")).toBeCloseTo(11.5);
    // });

    // test("Correct percentiles returned for multiple valid and invalid tasks", () => {
    //     branch = new Branch("", [makePipeline(undefined, undefined, new Map([["jkl", 4]])), makePipeline(undefined, undefined, new Map([["jkl", 2]])), makePipeline(undefined, undefined, new Map([["jkl", 3]])), makePipeline(undefined, undefined, new Map([["jkl", 1]]))]);
    //     let percentiles: Map<string, number> = branch.getPercentileTimesForPipelineTasks(40, ["jkl", "abc"]);
    //     expect(percentiles.get("jkl")).toBeCloseTo(2.1);
    //     expect(percentiles.get("abc")).toBeNull();
    //});
})