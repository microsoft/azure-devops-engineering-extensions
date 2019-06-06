"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureReleaseInterfaces = __importStar(require("azure-devops-node-api/interfaces/ReleaseInterfaces"));
var AbstractAzureApi_1 = require("./AbstractAzureApi");
var Release_1 = require("./Release");
var tl = require("azure-pipelines-task-lib/task");
var ReleaseAzureApi = /** @class */ (function (_super) {
    __extends(ReleaseAzureApi, _super);
    function ReleaseAzureApi(uri, accessKey) {
        return _super.call(this, uri, accessKey) || this;
    }
    ReleaseAzureApi.prototype.getCurrentPipeline = function (configurations) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getRelease(configurations.getProjectName(), configurations.getReleaseId())];
            });
        });
    };
    ReleaseAzureApi.prototype.getMostRecentPipelinesOfCurrentType = function (project, currentPipeline, maxNumber, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                tl.debug("project: " + project + ", definition id: " + currentPipeline.getDefinitionId() + ", environment definition id: " + currentPipeline.getEnvironmentDefinitionId() + ", desired status: " + ReleaseAzureApi.DESIRED_RELEASE_ENVIRONMENT_STATUS + ", number: " + maxNumber + ", branchName: " + branchName);
                return [2 /*return*/, this.getReleases(project, currentPipeline.getDefinitionId(), currentPipeline.getEnvironmentDefinitionId(), ReleaseAzureApi.DESIRED_RELEASE_ENVIRONMENT_STATUS, maxNumber, branchName)];
            });
        });
    };
    ReleaseAzureApi.prototype.getRelease = function (project, releaseId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tl.debug("sending for release with project name: " + project + " and release id: " + releaseId);
                        _a = Release_1.Release.bind;
                        return [4 /*yield*/, this.getReleaseData(project, releaseId)];
                    case 1: return [2 /*return*/, new (_a.apply(Release_1.Release, [void 0, _b.sent()]))()];
                }
            });
        });
    };
    ReleaseAzureApi.prototype.getReleases = function (project, definition, environmentDefinition, environmentStatus, maxNumber, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            var releases, rawReleasesData, numberRelease;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        releases = [];
                        return [4 /*yield*/, this.getConnection().getReleaseApi()];
                    case 1: return [4 /*yield*/, (_a.sent()).getReleases(project, definition, environmentDefinition, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, azureReleaseInterfaces.ReleaseExpands.Environments, undefined, undefined, undefined, branchName)];
                    case 2:
                        rawReleasesData = _a.sent();
                        for (numberRelease = 0; numberRelease < rawReleasesData.length; numberRelease++) {
                            releases[numberRelease] = new Release_1.Release(rawReleasesData[numberRelease]);
                        }
                        return [2 /*return*/, releases];
                }
            });
        });
    };
    ReleaseAzureApi.prototype.getReleaseData = function (project, releaseId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getReleaseApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getRelease(project, releaseId)];
                }
            });
        });
    };
    ReleaseAzureApi.DESIRED_RELEASE_ENVIRONMENT_STATUS = azureReleaseInterfaces.EnvironmentStatus.Succeeded + azureReleaseInterfaces.EnvironmentStatus.PartiallySucceeded + azureReleaseInterfaces.EnvironmentStatus.Rejected;
    return ReleaseAzureApi;
}(AbstractAzureApi_1.AbstractAzureApi));
exports.ReleaseAzureApi = ReleaseAzureApi;
