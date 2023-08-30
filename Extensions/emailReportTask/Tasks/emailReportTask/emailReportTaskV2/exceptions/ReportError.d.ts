export declare abstract class ReportError extends Error {
    innerError: any;
    constructor(message: string);
    getMessage(): string;
    static HandleError(err: Error, rethrow?: boolean): void;
}
