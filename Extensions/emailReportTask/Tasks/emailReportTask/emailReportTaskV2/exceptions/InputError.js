"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputError = void 0;
const ReportError_1 = require("./ReportError");
class InputError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = InputError.name;
    }
}
exports.InputError = InputError;
//# sourceMappingURL=InputError.js.map