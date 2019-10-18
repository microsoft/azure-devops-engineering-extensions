export class RetryablePromise {

    private static defaultRetryCount: number = 3;
    private attempNumber: number = 1;

    private ExecuteWithRetryAsync<T>(executor: Promise<T>, times: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            var retryTime = 1;
            executor
                .then((response) => resolve(response))
                .catch((error) => {
                    console.log(`Retry: ${retryTime} : ${JSON.stringify(error)}`);
                    return this.ExecuteWithRetryAsync(executor, times).then(resolve).catch(reject);
                });
        });
    }

    public static async RetryAsync<T>(executor: Promise<T>, times: number = this.defaultRetryCount): Promise<T> {
        return await new RetryablePromise().ExecuteWithRetryAsync(executor, times);
    }
}