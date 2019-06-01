"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var EnvironmentConfigurations_1 = require("../EnvironmentConfigurations");
var tl = __importStar(require("azure-pipelines-task-lib/task"));
var sinon_1 = __importDefault(require("sinon"));
describe("AzureApiFactory", function () {
    var configurations;
    var getVariableFake;
    function setUpGetVariableCall(parametersToOutputs) {
        parametersToOutputs.forEach(function (value, key) {
            console.log(key + " : " + value);
            getVariableFake.withArgs(key).returns(value);
        });
        sinon_1.default.stub(tl, "getVariable").callsFake(getVariableFake);
    }
    beforeEach(function () {
        configurations = new EnvironmentConfigurations_1.EnvironmentConfigurations();
        getVariableFake = sinon_1.default.stub();
    });
    afterEach(function () {
        sinon_1.default.restore();
    });
    test("Gets pull request id from system", function () {
        setUpGetVariableCall(new Map([["SYSTEM_PULLREQUEST_PULLREQUESTID", "9"], ["BUILD_SOURCEBRANCH", "ref/pull/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(9);
    });
    test("Gets pull request id from build", function () {
        setUpGetVariableCall(new Map([["SYSTEM_PULLREQUEST_PULLREQUESTID", undefined], ["BUILD_PULLREQUEST_ID", "10"], ["BUILD_SOURCEBRANCH", "ref/pull/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(10);
    });
    test("Gets pull request id from source branch", function () {
        setUpGetVariableCall(new Map([["SYSTEM_PULLREQUEST_PULLREQUESTID", undefined], ["BUILD_PULLREQUEST_ID", undefined], ["BUILD_SOURCEBRANCH", "ref/pull/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(11);
    });
    test("Gets no pull request id when pipeline is not result of pull request", function () {
        setUpGetVariableCall(new Map([["SYSTEM_PULLREQUEST_PULLREQUESTID", undefined], ["BUILD_PULLREQUEST_ID", undefined], ["BUILD_SOURCEBRANCH", "ref/11/master"]]));
        expect(configurations.getPullRequestId()).toBe(null);
    });
    test("Gets target branch from system", function () {
    });
    test("Gets target branch from build", function () {
    });
    test("Gets target branch by making api call", function () {
    });
});
