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
exports.ReleaseRestClient = void 0;
const ReleaseInterfaces_1 = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
const AbstractClient_1 = require("./AbstractClient");
const ChangeModel_1 = require("../../model/ChangeModel");
const util_1 = require("util");
class ReleaseRestClient extends AbstractClient_1.AbstractClient {
    constructor(pipelineConfig) {
        super(pipelineConfig);
    }
    getPipelineAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.getReleaseApi()).getRelease(this.pipelineConfig.$projectId, this.pipelineConfig.$pipelineId);
        });
    }
    getLastPipelineAsync(pipelineDefId, envDefId, sourceBranchFilter, maxCreatedDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const releaseApi = yield this.connection.getReleaseApi();
            let lastRelease = null;
            const releaseStatusFilter = ReleaseInterfaces_1.ReleaseStatus.Active;
            const envStatusFilter = ReleaseInterfaces_1.EnvironmentStatus.Succeeded | ReleaseInterfaces_1.EnvironmentStatus.PartiallySucceeded | ReleaseInterfaces_1.EnvironmentStatus.Rejected | ReleaseInterfaces_1.EnvironmentStatus.Canceled;
            const releases = yield releaseApi.getReleases(this.pipelineConfig.$projectId, pipelineDefId, envDefId, null, null, releaseStatusFilter, envStatusFilter, null, maxCreatedDate, ReleaseInterfaces_1.ReleaseQueryOrder.Descending, null, null, ReleaseInterfaces_1.ReleaseExpands.Environments, null, null, null, sourceBranchFilter);
            if (!util_1.isNullOrUndefined(releases) && releases.length > 0) {
                // Ideally, first one should be last completed one. Unless someone's running the report after the release has completed for some reason. 
                console.log(`Considering one of [${releases.map(r => r.id).join(",")}] as previous completed release for ${this.pipelineConfig.$pipelineId}`);
                for (let i = 0; i < releases.length; i++) {
                    if (releases[i].id < this.pipelineConfig.$pipelineId) {
                        lastRelease = releases[i];
                        break;
                    }
                }
            }
            if (util_1.isNullOrUndefined(lastRelease)) {
                console.log(`Unable to fetch last completed release for release definition:${pipelineDefId} and environmentid: ${envDefId}`);
            }
            else if (lastRelease.id < this.pipelineConfig.$pipelineId) {
                return yield releaseApi.getRelease(this.pipelineConfig.$projectId, lastRelease.id);
            }
            return lastRelease;
        });
    }
    getPipelineChangesAsync(prevPipelineId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching changes between releases - ${prevPipelineId} & ${this.pipelineConfig.$pipelineId}`);
            const changes = yield (yield this.connection.getReleaseApi()).getReleaseChanges(this.pipelineConfig.$projectId, this.pipelineConfig.$pipelineId, prevPipelineId);
            if (changes == null || changes.length < 1) {
                console.log(`No changes found between releases - ${prevPipelineId} & ${this.pipelineConfig.$pipelineId}`);
                return [];
            }
            return changes.map(item => new ChangeModel_1.ChangeModel(item.id, item.author, item.location, item.timestamp, item.message));
        });
    }
    getPipelineTimelineAsync(pipelineId) {
        throw new Error("Method not supported.");
    }
}
exports.ReleaseRestClient = ReleaseRestClient;
//# sourceMappingURL=ReleaseClient.js.map