import { TelemetryLogger } from "../../telemetry/TelemetryLogger";
const now = require('performance-now');

export class RetryablePromise {

    private static defaultRetryCount: number = 3;

    public static async RetryAsync<T>(executor: () => Promise<T>, executorName: string, times: number = this.defaultRetryCount): Promise<T> {
        const perfStart = now();
        let attemptNumber = 1;
        let lastError: Error;
        try {
            do {
                try {
                    let returnVal = await executor();
                    if (attemptNumber > 1) {
                        console.log(`Completed on Retry attempt: ${attemptNumber}`);
                    }
                    return returnVal;
                }
                catch (err) {
                    lastError = err;
                    console.log(`Retry: ${attemptNumber} : ${err}`);
                }
                attemptNumber++;
            } while (attemptNumber <= times);

            console.log(`All Retries exhausted. Throwing error: ${lastError}`);
            throw lastError;  
        }
        finally {
            if (attemptNumber > 1) {
                // Log time taken after all retries
                TelemetryLogger.LogModulePerf(executorName, now() - perfStart);
            }
        }
    }
}