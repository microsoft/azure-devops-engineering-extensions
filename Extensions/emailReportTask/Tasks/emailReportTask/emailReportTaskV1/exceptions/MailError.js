"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailError = void 0;
const ReportError_1 = require("./ReportError");
class MailError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = MailError.name;
    }
}
exports.MailError = MailError;
//# sourceMappingURL=MailError.js.map