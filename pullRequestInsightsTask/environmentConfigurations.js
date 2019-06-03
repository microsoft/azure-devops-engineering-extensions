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
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var EnvironmentConfigurations = /** @class */ (function () {
    function EnvironmentConfigurations() {
    }
    EnvironmentConfigurations.prototype.getTeamURI = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.TEAM_FOUNDATION_KEY);
    };
    EnvironmentConfigurations.prototype.getAccessKey = function () {
        return tl.getEndpointAuthorizationParameter(EnvironmentConfigurations.VSS_CONNECTION_KEY, EnvironmentConfigurations.ACCESS_PARAMETER, false);
    };
    EnvironmentConfigurations.prototype.getRepository = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.REPOSITORY_KEY);
    };
    EnvironmentConfigurations.prototype.getPullRequestId = function () {
        var pullRequestId = Number(this.tryKeys(EnvironmentConfigurations.PULL_REQUEST_ID_KEYS));
        var sourceBranch = this.getBuildSourceBranch().split(EnvironmentConfigurations.SEPERATOR);
        if (!pullRequestId && sourceBranch[1] === EnvironmentConfigurations.PULL_KEY) {
            pullRequestId = Number(sourceBranch[2]);
        }
        if (pullRequestId === undefined || isNaN(pullRequestId)) {
            return null;
        }
        return pullRequestId;
    };
    EnvironmentConfigurations.prototype.getProjectName = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.PROJECT_KEY);
    };
    EnvironmentConfigurations.prototype.getTargetBranch = function (apiCaller) {
        return __awaiter(this, void 0, void 0, function () {
            var targetBranch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetBranch = this.tryKeys(EnvironmentConfigurations.TARGET_BRANCH_KEYS);
                        if (!!targetBranch) return [3 /*break*/, 2];
                        return [4 /*yield*/, apiCaller.getPullRequestData(this.getRepository(), this.getPullRequestId(), this.getProjectName())];
                    case 1:
                        targetBranch = (_a.sent()).targetRefName;
                        _a.label = 2;
                    case 2:
                        if (!targetBranch) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, targetBranch];
                }
            });
        });
    };
    EnvironmentConfigurations.prototype.getHostType = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.HOST_KEY);
    };
    EnvironmentConfigurations.prototype.getReleaseId = function () {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.RELEASE_ID_KEY));
    };
    EnvironmentConfigurations.prototype.getBuildId = function () {
        return Number(this.loadFromEnvironment(EnvironmentConfigurations.BUILD_ID_KEY));
    };
    EnvironmentConfigurations.prototype.getBuildSourceBranch = function () {
        return this.loadFromEnvironment(EnvironmentConfigurations.BUILD_SOURCE_BRANCH_KEY);
    };
    EnvironmentConfigurations.prototype.tryKeys = function (keys) {
        var result;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            result = this.loadFromEnvironment(key);
            //  console.log("result " + result)
            if (result) {
                break;
            }
        }
        return result;
    };
    EnvironmentConfigurations.prototype.loadFromEnvironment = function (key) {
        return tl.getVariable(key);
    };
    EnvironmentConfigurations.TEAM_FOUNDATION_KEY = "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI";
    EnvironmentConfigurations.VSS_CONNECTION_KEY = "SYSTEMVSSCONNECTION";
    EnvironmentConfigurations.ACCESS_PARAMETER = "ACCESSTOKEN";
    EnvironmentConfigurations.REPOSITORY_KEY = "BUILD_REPOSITORY_NAME";
    EnvironmentConfigurations.PULL_REQUEST_ID_KEYS = ["SYSTEM_PULLREQUEST_PULLREQUESTID", "BUILD_PULLREQUEST_ID"];
    EnvironmentConfigurations.PROJECT_KEY = "SYSTEM_TEAMPROJECT";
    EnvironmentConfigurations.BUILD_ID_KEY = "BUILD_BUILDID";
    EnvironmentConfigurations.RELEASE_ID_KEY = "RELEASE_RELEASEID";
    EnvironmentConfigurations.HOST_KEY = "SYSTEM_HOSTTYPE";
    EnvironmentConfigurations.TARGET_BRANCH_KEYS = ["SYSTEM_PULLREQUEST_TARGETBRANCH", "BUILD_TARGETBRANCH"];
    EnvironmentConfigurations.BUILD_SOURCE_BRANCH_KEY = "BUILD_SOURCEBRANCH";
    EnvironmentConfigurations.PULL_KEY = "pull";
    EnvironmentConfigurations.SEPERATOR = "/";
    return EnvironmentConfigurations;
}());
exports.EnvironmentConfigurations = EnvironmentConfigurations;
