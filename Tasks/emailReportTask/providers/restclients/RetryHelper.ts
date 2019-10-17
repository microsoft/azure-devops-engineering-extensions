export class RetryHelper {

    private static defaultRetryCount: number = 3;

    public static async RetryAsync(func: any, times: number = this.defaultRetryCount): Promise<any> {

        var retryTime = 1;
        var result: any;
        do {
            try {
                result = await func;
                return result;
            } catch (ex) {
                if (retryTime >= times) {
                    throw ex;
                }
                retryTime++;
                console.log(`Attempt ${retryTime} failed with error ${ex}`);
            }
        } while (true);
    }
}