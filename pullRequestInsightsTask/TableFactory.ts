import { AbstractTable } from "./AbstractTable";
import { FailureTable } from "./FailureTable";
import { LongRunningValidationsTable } from "./LongRunningValidationsTable";

export class TableFactory {
    
    public static readonly LONG_RUNNING_VALIDATIONS: string = "longRunning";
    public static readonly FAILURE: string = "failure";

    public static create(type: string, currentCommentContent?: string): AbstractTable {
        if (type.toLowerCase() === this.FAILURE.toLowerCase()) {
            return new FailureTable(currentCommentContent);
        }
        if (type.toLowerCase() === this.LONG_RUNNING_VALIDATIONS.toLowerCase()) {
            return new LongRunningValidationsTable(currentCommentContent);
        }
        return null;
    }
}