"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingDataError = void 0;
const ReportError_1 = require("./ReportError");
class MissingDataError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = MissingDataError.name;
    }
}
exports.MissingDataError = MissingDataError;
//# sourceMappingURL=MissingDataError.js.map