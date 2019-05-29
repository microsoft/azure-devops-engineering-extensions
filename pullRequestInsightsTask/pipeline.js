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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureBuildInterfaces = __importStar(require("azure-devops-node-api/interfaces/BuildInterfaces"));
var PipelineFactory = /** @class */ (function () {
    function PipelineFactory(apiCaller) {
        this.apiCaller = apiCaller;
    }
    PipelineFactory.prototype.create = function (type, project, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (type === PipelineFactory.BUILD) {
                    return [2 /*return*/, this.apiCaller.getBuild(project, id)];
                }
                if (type === PipelineFactory.RELEASE) {
                    return [2 /*return*/, this.apiCaller.getBuild(project, id)];
                }
                throw (new Error("ERROR: CANNOT RUN FOR HOST TYPE " + type));
            });
        });
    };
    PipelineFactory.BUILD = "build";
    PipelineFactory.RELEASE = "release";
    return PipelineFactory;
}());
exports.PipelineFactory = PipelineFactory;
var Release = /** @class */ (function () {
    function Release(apiCaller, project, id) {
        this.apiCaller = apiCaller;
        this.project = project;
        this.id = id;
    }
    Release.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.apiCaller.getRelease(this.project, this.id)];
                    case 1:
                        _a.releaseData = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Release.prototype.isFailure = function () {
        return true;
    };
    Release.prototype.isComplete = function () {
        return true;
    };
    Release.prototype.getLink = function () {
        return "";
    };
    Release.prototype.getId = function () {
        return this.id;
    };
    return Release;
}());
exports.Release = Release;
var Build = /** @class */ (function () {
    function Build(buildData, timelineData) {
        // this.apiCaller = apiCaller;
        // this.project = project;
        this.buildData = buildData;
        this.timelineData = timelineData;
    }
    // public async loadData(): Promise<void> {
    //     this.buildData = await this.apiCaller.getBuild(this.project, this.id);
    //     this.timelineData = await this.apiCaller.getBuildTimeline(this.project, this.id);
    // }
    // public hasFailed() : boolean{
    //     return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
    // }
    Build.prototype.isFailure = function () {
        var _this = this;
        var failed = false;
        if (this.timelineData.records !== undefined) {
            this.timelineData.records.forEach(function (taskRecord) {
                if (_this.taskFailed(taskRecord)) {
                    failed = true;
                }
            });
        }
        return failed;
    };
    Build.prototype.isComplete = function () {
        return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
    };
    Build.prototype.getDefinitionId = function () {
        if (this.buildData.definition !== undefined && this.buildData.definition.id !== undefined) {
            return this.buildData.definition.id;
        }
        throw (new Error("no definition available"));
    };
    Build.prototype.getLink = function () {
        return String(this.buildData._links.web.href);
    };
    Build.prototype.getId = function () {
        return Number(this.buildData.id);
    };
    Build.prototype.taskFailed = function (task) {
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed;
    };
    return Build;
}());
exports.Build = Build;
