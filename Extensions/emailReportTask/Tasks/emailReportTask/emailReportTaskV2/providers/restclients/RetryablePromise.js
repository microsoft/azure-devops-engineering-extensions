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
exports.RetryablePromise = void 0;
const TelemetryLogger_1 = require("../../telemetry/TelemetryLogger");
const now = require('performance-now');
class RetryablePromise {
    static RetryAsync(executor, executorName, times = this.defaultRetryCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const perfStart = now();
            let attemptNumber = 1;
            let lastError;
            try {
                do {
                    try {
                        let returnVal = yield executor();
                        if (attemptNumber > 1) {
                            console.log(`Completed on Retry attempt: ${attemptNumber}`);
                        }
                        return returnVal;
                    }
                    catch (err) {
                        lastError = err;
                        console.log(`Retry <${executorName}>: ${attemptNumber} : ${err}`);
                    }
                    attemptNumber++;
                } while (attemptNumber <= times);
                console.log(`All Retries exhausted. Throwing error: ${lastError}`);
                throw lastError;
            }
            finally {
                if (attemptNumber > 1) {
                    // Log time taken after all retries
                    TelemetryLogger_1.TelemetryLogger.LogModulePerf(executorName, now() - perfStart);
                }
            }
        });
    }
}
exports.RetryablePromise = RetryablePromise;
RetryablePromise.defaultRetryCount = 3;
//# sourceMappingURL=RetryablePromise.js.map