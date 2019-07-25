import tl = require("azure-pipelines-task-lib/task");
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractTable } from "./AbstractTable";
import { AbstractPipeline } from "../dataModels/AbstractPipeline";
import { TableFactory } from "../factories/TableFactory";
import messages from "../resources/user_messages.json";
import { TaskInsights } from "../TaskInsights";
import { Branch } from "../dataModels/Branch";
import { PipelineTask } from "../dataModels/PipelineTask";

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
    } else {
      this.initializeNewCommentContent();
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

  public formatNewData(
    tableType: string,
    currentPipeline: AbstractPipeline,
    checkStatusLink: string,
    target: Branch,
    longRunningValidations: PipelineTask[],
    percentile: string
  ) {
    this.removeLastLine();
    tl.debug("type of table to create: " + tableType);
    this.manageTable(
      tableType,
      currentPipeline,
      checkStatusLink,
      target,
      longRunningValidations,
      percentile
    );
    this.addFeedbackLine();
  }

  private initializeNewCommentContent(): void {
    this.content = messages.summaryLine;
    this.addFeedbackLine();
  }

  private addFeedbackLine(): void {
    this.content += AbstractTable.NEW_LINE + messages.feedbackLine;
  }

  private removeLastLine(): void {
    // feedback line is always last
    const splitMessage: string[] = this.content.split(AbstractTable.NEW_LINE);
    this.content = splitMessage
      .splice(0, splitMessage.length - 1)
      .join(AbstractTable.NEW_LINE);
  }

  private manageTable(
    tableType: string,
    currentPipeline: AbstractPipeline,
    checkStatusLink: string,
    target: Branch,
    longRunningValidations: PipelineTask[],
    percentile: string
  ): void {
    const table: AbstractTable = TableFactory.create(tableType, this.content);
    tl.debug("comment data: " + table.getCurrentCommentData());
    table.addHeader(target.getTruncatedName(), percentile);
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
