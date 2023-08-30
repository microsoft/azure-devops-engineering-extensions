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
exports.ReleaseTestResultsClient = void 0;
const AbstractTestResultsClient_1 = require("./AbstractTestResultsClient");
class ReleaseTestResultsClient extends AbstractTestResultsClient_1.AbstractTestResultsClient {
    constructor(pipelineConfig) {
        super(pipelineConfig);
    }
    queryTestResultsReportForPipelineAsync(config, includeFailures) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.testApiPromise).queryTestResultsReportForRelease(config.$projectName, config.$pipelineId, config.$environmentId, null, includeFailures);
        });
    }
    getTestResultsDetailsForPipelineAsync(config, groupBy, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.testApiPromise).getTestResultDetailsForRelease(config.$projectName, config.$pipelineId, config.$environmentId, null, groupBy, filter);
        });
    }
}
exports.ReleaseTestResultsClient = ReleaseTestResultsClient;
//# sourceMappingURL=ReleaseTestResultsClient.js.map