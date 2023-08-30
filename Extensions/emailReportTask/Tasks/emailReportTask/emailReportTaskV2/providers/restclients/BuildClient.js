"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildRestClient = void 0;
const BuildInterfaces_1 = require("azure-devops-node-api/interfaces/BuildInterfaces");
const ChangeModel_1 = require("../../model/ChangeModel");
const AbstractClient_1 = require("./AbstractClient");
class BuildRestClient extends AbstractClient_1.AbstractClient {
    constructor(pipelineConfig) {
        super(pipelineConfig);
        this.buildApi = this.connection.getBuildApi();
    }
    getPipelineAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.buildApi).getBuild(this.pipelineConfig.$projectId, this.pipelineConfig.$pipelineId);
        });
    }
    getLastPipelineAsync(pipelineDefId, envDefId, sourceBranchFilter, maxCreatedDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const builds = yield (yield this.buildApi).getBuilds(this.pipelineConfig.$projectId, [pipelineDefId], null, null, null, maxCreatedDate, null, null, null, BuildInterfaces_1.BuildResult.Succeeded | BuildInterfaces_1.BuildResult.PartiallySucceeded | BuildInterfaces_1.BuildResult.Failed | BuildInterfaces_1.BuildResult.Canceled, null, null, 1, null, null, null, BuildInterfaces_1.BuildQueryOrder.FinishTimeDescending, sourceBranchFilter);
            if (builds != null && builds.length > 0) {
                return builds[0];
            }
            console.log(`Unable to find any build for definition id - ${pipelineDefId}`);
            return null;
        });
    }
    getPipelineChangesAsync(prevPipelineId) {
        return __awaiter(this, void 0, void 0, function* () {
            const changes = yield (yield this.buildApi).getBuildChanges(this.pipelineConfig.$projectId, this.pipelineConfig.$pipelineId);
            if (changes == null || changes.length < 1) {
                console.log(`No changes found for pipelineId - ${this.pipelineConfig.$pipelineId}`);
                return [];
            }
            return changes.map(item => new ChangeModel_1.ChangeModel(item.id, item.author, item.location, item.timestamp, item.message));
        });
    }
    getPipelineTimelineAsync(pipelineId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.buildApi).getBuildTimeline(this.pipelineConfig.$projectId, pipelineId);
        });
    }
}
exports.BuildRestClient = BuildRestClient;
//# sourceMappingURL=BuildClient.js.map