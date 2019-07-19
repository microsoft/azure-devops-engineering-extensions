import { EnvironmentConfigurations } from "../config/environmentConfigurations";
import * as tl from 'azure-pipelines-task-lib/task';
import sinon from "sinon";

describe("EnvirnmentConfigurations Tests", () => {

    let configurations: EnvironmentConfigurations;
    let getVariableFake: sinon.SinonStub;

    function setUpGetVariableCall(parametersToOutputs: Map<string, string>): void {
        parametersToOutputs.forEach((value: string, key: string) => {
            getVariableFake.withArgs(key).returns(value);
        });
        sinon.stub(tl, "getVariable").callsFake(getVariableFake);
    }
   
    beforeEach(() =>{
        configurations = new EnvironmentConfigurations();
        getVariableFake = sinon.stub();
    });

    afterEach(() => {
        sinon.restore()
    });

    test("Gets pull request id from system", () =>{
        setUpGetVariableCall(new Map<string,string>([["SYSTEM_PULLREQUEST_PULLREQUESTID", "9"], ["BUILD_SOURCEBRANCH", "ref/pull/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(9); 
    });

     test("Gets pull request id from build", () =>{
       setUpGetVariableCall(new Map<string,string>([["SYSTEM_PULLREQUEST_PULLREQUESTID", undefined], ["BUILD_PULLREQUEST_ID", "10"], ["BUILD_SOURCEBRANCH", "ref/pull/11/master"]]));
       expect(configurations.getPullRequestId()).toBe(10); 
     });

    test("Gets pull request id from source branch", () =>{
        setUpGetVariableCall(new Map<string,string>([["SYSTEM_PULLREQUEST_PULLREQUESTID", undefined], ["BUILD_PULLREQUEST_ID", undefined], ["BUILD_SOURCEBRANCH", "ref/pull/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(11); 
    });

    test("Gets no pull request id when pipeline is not result of pull request", () =>{
        setUpGetVariableCall(new Map<string,string>([["SYSTEM_PULLREQUEST_PULLREQUESTID", undefined], ["BUILD_PULLREQUEST_ID", undefined], ["BUILD_SOURCEBRANCH", "ref/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(null); 
    });


})