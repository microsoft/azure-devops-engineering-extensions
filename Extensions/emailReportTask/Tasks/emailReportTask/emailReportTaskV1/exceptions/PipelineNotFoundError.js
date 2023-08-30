"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineNotFoundError = void 0;
const ReportError_1 = require("./ReportError");
class PipelineNotFoundError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = "PipelineNotFoundError";
    }
}
exports.PipelineNotFoundError = PipelineNotFoundError;
//# sourceMappingURL=PipelineNotFoundError.js.map