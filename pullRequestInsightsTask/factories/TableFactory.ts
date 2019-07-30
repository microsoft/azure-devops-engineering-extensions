import { AbstractTable } from "../models/AbstractTable";
import { FailureTable } from "../models/FailureTable";
import { LongRunningValidationsTable } from "../models/LongRunningValidationsTable";

export class TableFactory {
  public static readonly LONG_RUNNING_VALIDATIONS: string = "longRunning";
  public static readonly FAILURE: string = "failure";

  /**
   * Creates table of correct type based on input type
   * Supports failure and longRunning
   * @param type Type of table to create
   * @param currentCommentContent Content table should already include
   */
  public static create(
    type: string,
    currentCommentContent?: string
  ): AbstractTable {
    if (type.toLowerCase() === this.FAILURE.toLowerCase()) {
      return new FailureTable(currentCommentContent);
    }
    if (type.toLowerCase() === this.LONG_RUNNING_VALIDATIONS.toLowerCase()) {
      return new LongRunningValidationsTable(currentCommentContent);
    }
    return null;
  }
}
