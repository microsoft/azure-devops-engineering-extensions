"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportError = void 0;
const util_1 = require("util");
class ReportError extends Error {
    constructor(message) {
        super(message);
    }
    getMessage() {
        const stack = util_1.isNullOrUndefined(this.innerError) || util_1.isNullOrUndefined(this.innerError.stack) ? this.stack :
            `${this.stack}\r\nInnerError:${this.innerError.message}: ${this.innerError.stack}`;
        return `${this.name}: ${this.message}\r\n ${stack}`;
    }
    static HandleError(err, rethrow = false) {
        if (err instanceof ReportError) {
            console.error(err.getMessage());
        }
        else {
            console.error(err);
        }
        if (rethrow) {
            throw err;
        }
    }
}
exports.ReportError = ReportError;
//# sourceMappingURL=ReportError.js.map