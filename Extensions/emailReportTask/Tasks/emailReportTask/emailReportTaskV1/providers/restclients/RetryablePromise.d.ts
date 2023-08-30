export declare class RetryablePromise {
    private static defaultRetryCount;
    static RetryAsync<T>(executor: () => Promise<T>, executorName: string, times?: number): Promise<T>;
}
