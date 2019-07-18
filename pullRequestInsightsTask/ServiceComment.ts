import { PipelineData } from "./PipelineData";
import { AzureApiFactory } from "./AzureApiFactory";
import { Branch } from "./Branch";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { PullRequest } from "./PullRequest";
import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { AbstractTable } from "./AbstractTable";
import { AbstractPipeline } from "./AbstractPipeline";
import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import { TableFactory } from "./TableFactory";
import messages from './user_messages.json';
import { TaskInsights } from "./TaskInsights";
import { PipelineTask } from "./PipelineTask";

export class ServiceComment {

    private id: number;
    private parentThreadId: number;
    private content: string;

    constructor(commentData?: azureGitInterfaces.Comment, parentThreadId?: number) {
        if (commentData) {
            this.id = commentData.id;
            this.content = commentData.content;
        }
        else {
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

    public formatNewData(tableType: string, currentPipeline: AbstractPipeline, checkStatusLink: string, target: Branch, longRunningValidations: PipelineTask[]) {
        this.removeLastLine();
        tl.debug("type of table to create: " + tableType);
        this.manageTable(tableType, currentPipeline, checkStatusLink, target, longRunningValidations);
        this.addFeedbackLine();
    }

    private initializeNewCommentContent() {
        this.content = messages.summaryLine;
        this.addFeedbackLine();
    }

    private addFeedbackLine(): void {
        this.content += AbstractTable.NEW_LINE + messages.feedbackLine;
    }

    private removeLastLine(): void { // feedback line is always last
        let splitMessage: string[] = this.content.split(AbstractTable.NEW_LINE);
        this.content = splitMessage.splice(0, splitMessage.length - 1).join(AbstractTable.NEW_LINE);
    }

    private manageTable(tableType: string, currentPipeline: AbstractPipeline, checkStatusLink: string, target: Branch, longRunningValidations: PipelineTask[]): void {
        let table: AbstractTable = TableFactory.create(tableType, this.content);
        tl.debug("comment data: " + table.getCurrentCommentData());
        table.addHeader(target.getTruncatedName());
        table.addSection(currentPipeline, checkStatusLink, target, TaskInsights.NUMBER_PIPELINES_FOR_HEALTH, longRunningValidations);
        this.content = table.getCurrentCommentData();
    }


}