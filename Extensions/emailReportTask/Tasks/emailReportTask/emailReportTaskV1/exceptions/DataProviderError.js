"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProviderError = void 0;
const ReportError_1 = require("./ReportError");
class DataProviderError extends ReportError_1.ReportError {
    constructor(message) {
        super(message);
        this.name = DataProviderError.name;
    }
}
exports.DataProviderError = DataProviderError;
//# sourceMappingURL=DataProviderError.js.map