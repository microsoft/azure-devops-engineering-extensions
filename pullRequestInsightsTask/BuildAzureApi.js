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
var AbstractAzureApi_1 = require("./AbstractAzureApi");
var azureBuildInterfaces = __importStar(require("azure-devops-node-api/interfaces/BuildInterfaces"));
var Build_1 = require("./Build");
var BuildAzureApi = /** @class */ (function (_super) {
    __extends(BuildAzureApi, _super);
    function BuildAzureApi(uri, accessKey) {
        return _super.call(this, uri, accessKey) || this;
    }
    BuildAzureApi.prototype.getCurrentPipeline = function (configurations) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBuild(configurations.getProjectName(), configurations.getBuildId())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BuildAzureApi.prototype.getMostRecentPipelinesOfCurrentType = function (project, currentPipeline, maxNumber, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBuilds(project, currentPipeline.getDefinitionId(), BuildAzureApi.DESIRED_BUILD_REASON, BuildAzureApi.DESIRED_BUILD_STATUS, maxNumber, branchName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BuildAzureApi.prototype.getBuild = function (project, buildId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Build_1.Build.bind;
                        return [4 /*yield*/, this.getBuildData(project, buildId)];
                    case 1:
                        _b = [void 0, _c.sent()];
                        return [4 /*yield*/, this.getBuildTimeline(project, buildId)];
                    case 2: return [2 /*return*/, new (_a.apply(Build_1.Build, _b.concat([_c.sent()])))()];
                }
            });
        });
    };
    BuildAzureApi.prototype.getBuilds = function (project, definition, reason, status, maxNumber, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            var builds, rawBuildsData, _i, rawBuildsData_1, buildData, timeline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        builds = [];
                        return [4 /*yield*/, this.getConnection().getBuildApi()];
                    case 1: return [4 /*yield*/, (_a.sent()).getBuilds(project, Array(definition), undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName)];
                    case 2:
                        rawBuildsData = _a.sent();
                        _i = 0, rawBuildsData_1 = rawBuildsData;
                        _a.label = 3;
                    case 3:
                        if (!(_i < rawBuildsData_1.length)) return [3 /*break*/, 6];
                        buildData = rawBuildsData_1[_i];
                        return [4 /*yield*/, this.getBuildTimeline(project, buildData.id)];
                    case 4:
                        timeline = _a.sent();
                        if (timeline !== null) {
                            builds.push(new Build_1.Build(buildData, timeline));
                        }
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, builds];
                }
            });
        });
    };
    BuildAzureApi.prototype.getBuildData = function (project, buildId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getBuildApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getBuild(project, buildId)];
                }
            });
        });
    };
    BuildAzureApi.prototype.getBuildTimeline = function (project, buildId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getBuildApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getBuildTimeline(project, buildId)];
                }
            });
        });
    };
    BuildAzureApi.DESIRED_BUILD_REASON = azureBuildInterfaces.BuildReason.BatchedCI + azureBuildInterfaces.BuildReason.IndividualCI;
    BuildAzureApi.DESIRED_BUILD_STATUS = azureBuildInterfaces.BuildStatus.Completed;
    return BuildAzureApi;
}(AbstractAzureApi_1.AbstractAzureApi));
exports.BuildAzureApi = BuildAzureApi;
