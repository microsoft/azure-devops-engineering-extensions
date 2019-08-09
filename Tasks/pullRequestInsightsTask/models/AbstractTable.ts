import { AbstractPipeline } from "../dataModels/AbstractPipeline";
import "../utils/StringExtensions";
import tl = require("azure-pipelines-task-lib/task");
import { PipelineTask } from "../dataModels/PipelineTask";
import { Branch } from "../dataModels/Branch";

/**
 * This class represents a table within a comment that can parse comment data in order to add a new table or
 * add data to an existing table of the same type as itself
 */
export abstract class AbstractTable {
  private currentCommentData: string;
  private headerFormat: string;
  private tableEndLine: string;
  public static readonly NEW_LINE = "\n";
  public static readonly COLUMN_DIVIDER = "|";
  public static readonly HEADER_SYMBOL = "---";
  public static readonly TABLE_END_TAG = "<!--{0}-->";

  constructor(
    headerFormat: string,
    tableEndName: string,
    currentCommentData?: string
  ) {
    this.headerFormat = headerFormat;
    this.tableEndLine = AbstractTable.TABLE_END_TAG.format(tableEndName);
    if (currentCommentData) {
      this.currentCommentData = currentCommentData;
    } else {
      this.currentCommentData = "";
    }
    console.log("table already exists in comment? " + this.tableHasData());
  }

  /**
   * Adds header text and markdown header symbols to empty table
   * @param targetName Name of target branch
   * @param percentile Percentile set for regression calculation
   * @param numberPipelinesForHealth Number of pipelines being used for failure table target branch status
   */
  public addHeader(
    targetName: string,
    percentile: string,
    numberPipelinesForHealth: string
  ): void {
    if (!this.tableHasData()) {
      this.addTextToTableInComment(
        AbstractTable.NEW_LINE +
          this.headerFormat.format(
            targetName,
            percentile,
            numberPipelinesForHealth
          )
      );
      const numberColumns: number = this.getNumberColumns(
        this.currentCommentData
      );
      this.addTextToTableInComment(
        AbstractTable.NEW_LINE + AbstractTable.COLUMN_DIVIDER
      );
      for (let i = 0; i < numberColumns; i++) {
        this.addTextToTableInComment(
          AbstractTable.HEADER_SYMBOL + AbstractTable.COLUMN_DIVIDER
        );
      }
    }
  }

  /**
   * Adds section of row or rows to table to represent data from pipeline run
   * @param current Pipeline which task is running within
   * @param currentDefinitionLink Link for failed pipeline status check
   * @param target Target branch of pull request
   * @param numberPipelinesToConsiderForHealth Number of pipelines being used for failure table target branch status
   * @param longRunningValidations Regressive tasks
   */
  public abstract addSection(
    current: AbstractPipeline,
    currentDefinitionLink: string,
    target: Branch,
    numberPipelinesToConsiderForHealth: number,
    longRunningValidations: PipelineTask[]
  ): void;

  /**
   * Returns all data currently in comment
   */
  public getCurrentCommentData(): string {
    return this.currentCommentData;
  }

  /**
   * Determines if table of this type exists in comment
   */
  protected tableHasData(): boolean {
    return this.currentCommentData.indexOf(this.tableEndLine) >= 0;
  }

  /**
   * Adds text to table within existing comment, either by creating new table or
   * by editing table by locating end tag of this table
   * @param data Text to add to this table
   */
  protected addTextToTableInComment(data: string): void {
    if (this.tableHasData()) {
      console.log("adding data to table: " + data);
      this.currentCommentData = this.currentCommentData.replace(
        this.tableEndLine,
        data + this.tableEndLine
      );
    } else {
      if (!this.commentIsEmpty()) {
        this.currentCommentData +=
          AbstractTable.NEW_LINE + AbstractTable.NEW_LINE;
      }
      this.currentCommentData += data + this.tableEndLine;
    }
  }

  /**
   * Determines if current comment has any text
   */
  private commentIsEmpty(): boolean {
    return !this.currentCommentData || this.currentCommentData === "";
  }

  /**
   * Finds the number of markdown columns in a string based on | characters
   * @param line String for which count columns
   */
  private getNumberColumns(line: string): number {
    let numberColumns: number = -1;
    for (const char of line) {
      if (char === AbstractTable.COLUMN_DIVIDER) {
        numberColumns++;
      }
    }
    return numberColumns;
  }
}
