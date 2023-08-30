"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostProcessorError = void 0;
const ReportError_1 = require("./ReportError");
class PostProcessorError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = PostProcessorError.name;
    }
}
exports.PostProcessorError = PostProcessorError;
//# sourceMappingURL=PostProcessorError.js.map