export class RetryablePromise {

    private static defaultRetryCount: number = 3;

    public static async RetryAsync<T>(executor: () => Promise<T>, times: number = this.defaultRetryCount): Promise<T> {
        let attemptNumber = 1;
        let lastError: Error;
        do {
            try {
                return await executor();
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
}