import { Table, LongRunningValidationsTable, FailureTable } from "./Table";

export class TableFactory {
    
    public static readonly LONG_RUNNING_VALIDATIONS: string = "longRunning";
    public static readonly FAILURE: string = "failure";

    public static create(type: string, currentCommentContent?: string): Table {
        if (type.toLowerCase() === TableFactory.FAILURE.toLowerCase()) {
            return new FailureTable(currentCommentContent);
        }
        if (type.toLowerCase() === TableFactory.LONG_RUNNING_VALIDATIONS.toLowerCase()) {
            return new LongRunningValidationsTable(currentCommentContent);
        }
        return null;
    }
}