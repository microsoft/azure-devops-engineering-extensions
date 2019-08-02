import tl = require("azure-pipelines-task-lib/task");
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractTable } from "./AbstractTable";
import { AbstractPipeline } from "../dataModels/AbstractPipeline";
import { TableFactory } from "../factories/TableFactory";
import messages from "../resources/user_messages.json";
import { TaskInsights } from "../TaskInsights";
import { Branch } from "../dataModels/Branch";
import { PipelineTask } from "../dataModels/PipelineTask";

/**
 * This class builds the comment content from PR Insights task to be posted upon a pull request page
 */
export class ServiceComment {
  private id: number;
  private parentThreadId: number;
  private content: string;

  constructor(
    commentData?: azureGitInterfaces.Comment,
    parentThreadId?: number
  ) {
    if (commentData) {
      this.id = commentData.id;
      this.content = commentData.content;
    }
    this.parentThreadId = parentThreadId;
  }

  public getParentThreadId(): number {
    return this.parentThreadId;
  }

  public getId(): number {
    return this.id;
  }

  public getContent(): string {
    return this.content;
  }

  /**
   * Formats data from task into appropriate comment string
   * @param tableType Type of table to add to comment
   * @param currentPipeline Pipeline which task is running within
   * @param checkStatusLink Link for failed pipeline status check
   * @param target Target branch of pull request
   * @param longRunningValidations Regressive tasks
   * @param percentile Percentile set for regression calculation
   * @param numberPipelinesForHealth Number of pipelines being used for failure table target branch status
   * @param feedbackLine Line to add to end of comment for giving a contact for feedback
   */
  public formatNewData(
    tableType: string,
    currentPipeline: AbstractPipeline,
    checkStatusLink: string,
    target: Branch,
    longRunningValidations: PipelineTask[],
    percentile: string,
    numberPipelinesForHealth: string,
    feedbackLine: string
  ) {
    if (!this.content) {
      this.initializeNewCommentContent();
    }
    console.log("type of table to create: " + tableType);
    this.manageTable(
      tableType,
      currentPipeline,
      checkStatusLink,
      target,
      longRunningValidations,
      percentile,
      numberPipelinesForHealth
    );
    if (feedbackLine) {
      feedbackLine =
        AbstractTable.NEW_LINE + messages.smallText.format(feedbackLine);
      this.removeFeedbackLineFromComment(feedbackLine);
      this.addFeedbackLineToEndOfComment(feedbackLine);
    }
  }

  /**
   * Adds data to a brand new comment
   */
  private initializeNewCommentContent(): void {
    this.content = messages.summaryLine;
  }

  /**
   * Attaches line to end of comment
   */
  private addFeedbackLineToEndOfComment(feedbackLine: string): void {
    this.content += feedbackLine;
  }

  /**
   * Removes line from comment if it matches the feedback line
   */
  private removeFeedbackLineFromComment(feedbackLine: string): void {
    this.content = this.content.replace(feedbackLine, "");
  }

  /**
   * Puts task data into appropriate table with header and data section
   * @param tableType Type of table to add to comment
   * @param currentPipeline Pipeline which task is running within
   * @param checkStatusLink Link for failed pipeline status check
   * @param target Target branch of pull request
   * @param longRunningValidations Regressive tasks
   * @param percentile Percentile set for regression calculation
   * @param numberPipelinesForHealth umber of pipelines being used for failure table target branch status
   */
  private manageTable(
    tableType: string,
    currentPipeline: AbstractPipeline,
    checkStatusLink: string,
    target: Branch,
    longRunningValidations: PipelineTask[],
    percentile: string,
    numberPipelinesForHealth: string
  ): void {
    const table: AbstractTable = TableFactory.create(tableType, this.content);
    console.log("comment data before adding: " + table.getCurrentCommentData());
    table.addHeader(
      target.getTruncatedName(),
      percentile,
      numberPipelinesForHealth
    );
    table.addSection(
      currentPipeline,
      checkStatusLink,
      target,
      TaskInsights.NUMBER_PIPELINES_FOR_HEALTH,
      longRunningValidations
    );
    this.content = table.getCurrentCommentData();
  }
}
