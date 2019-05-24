"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var azureApi_1 = require("./azureApi");
var environmentConfigurations_1 = require("./environmentConfigurations");
var build_1 = require("./build");
var fs = require('fs');
var user_messages_json_1 = __importDefault(require("./user_messages.json"));
var azureBuildInterfaces = __importStar(require("azure-devops-node-api/interfaces/BuildInterfaces"));
var branch_1 = require("./branch");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var pastFailureThreshold, numberBuildsToQuery, desiredBuildReasons, desiredBuildStatus, configurations, azureApi, currentProject, currentBuildId, currentBuild, _a, _b, _c, retrievedBuilds, targetBranch, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    pastFailureThreshold = 2;
                    numberBuildsToQuery = 10;
                    desiredBuildReasons = azureBuildInterfaces.BuildReason.BatchedCI + azureBuildInterfaces.BuildReason.IndividualCI;
                    desiredBuildStatus = azureBuildInterfaces.BuildStatus.Completed;
                    configurations = new environmentConfigurations_1.EnvironmentConfigurations();
                    azureApi = new azureApi_1.AzureApi(configurations.getTeamURI(), configurations.getAccessKey());
                    currentProject = configurations.getProjectName();
                    currentBuildId = configurations.getBuildId();
                    _a = build_1.Build.bind;
                    return [4 /*yield*/, azureApi.getBuild(currentProject, currentBuildId)];
                case 1:
                    currentBuild = new (_a.apply(build_1.Build, [void 0, _d.sent()]))();
                    if (!!configurations.getPullRequestId()) return [3 /*break*/, 2];
                    tl.debug(user_messages_json_1.default.notInPullRequestMessage);
                    return [3 /*break*/, 6];
                case 2:
                    _c = (_b = currentBuild).willFail;
                    return [4 /*yield*/, azureApi.getBuildTimeline(currentProject, currentBuildId)];
                case 3:
                    if (!!_c.apply(_b, [_d.sent()])) return [3 /*break*/, 4];
                    tl.debug(user_messages_json_1.default.noFailureMessage);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, azureApi.getBuilds(currentProject, new Array(currentBuild.getDefinitionId()), desiredBuildReasons, desiredBuildStatus, numberBuildsToQuery, configurations.getTargetBranch())];
                case 5:
                    retrievedBuilds = _d.sent();
                    targetBranch = new branch_1.Branch(configurations.getTargetBranch(), convertBuildData(retrievedBuilds));
                    if (tooManyBuildsFailed(targetBranch.getBuildFailStreak(), pastFailureThreshold)) {
                        postBuildFailuresComment(azureApi, targetBranch, configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName());
                    }
                    _d.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _d.sent();
                    console.log("error!", err_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function convertBuildData(retrievedBuildsData) {
    var builds = [];
    for (var numberBuild = 0; numberBuild < retrievedBuildsData.length; numberBuild++) {
        builds[numberBuild] = new build_1.Build(retrievedBuildsData[numberBuild]);
    }
    return builds;
}
function tooManyBuildsFailed(failedBuilds, pastFailureThreshold) {
    return failedBuilds >= pastFailureThreshold;
}
function postBuildFailuresComment(azureApi, targetBranch, pullRequestId, repository, project) {
    var mostRecentTargetFailedBuild = targetBranch.getMostRecentFailedBuild();
    if (mostRecentTargetFailedBuild !== null) {
        var thread = { comments: new Array({ content: format(user_messages_json_1.default.buildFailureComment, mostRecentTargetFailedBuild.getLink(), String(targetBranch.getBuildFailStreak()), targetBranch.getName()) }) };
        azureApi.postNewCommentThread(thread, pullRequestId, repository, project);
        tl.debug(user_messages_json_1.default.commentCompletedMessage);
    }
}
function format(text) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return text.replace(/{(\d+)}/g, function (match, num) {
        return typeof args[num] !== 'undefined' ? args[num] : match;
    });
}
run();
