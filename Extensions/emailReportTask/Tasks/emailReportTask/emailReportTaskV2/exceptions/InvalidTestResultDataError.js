"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTestResultDataError = void 0;
const ReportError_1 = require("./ReportError");
class InvalidTestResultDataError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = InvalidTestResultDataError.name;
    }
}
exports.InvalidTestResultDataError = InvalidTestResultDataError;
//# sourceMappingURL=InvalidTestResultDataError.js.map