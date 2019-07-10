import messages from './user_messages.json';
import { AbstractPipeline } from "./AbstractPipeline";
import { Branch } from "./Branch";
import './StringExtensions';
import { AbstractPipelineTask } from "./AbstractPipelineTask";
import tl = require('azure-pipelines-task-lib/task');

export abstract class Table {

    private currentCommentData: string;
    private headerFormat: string;
    private tableEndLine: string
    public static readonly NEW_LINE = "\n";
    public static readonly COLUMN_DIVIDER = "|";
    public static readonly HEADER_SYMBOL = "---";
    public static readonly TABLE_END_TAG = "<!--{0}-->";

    constructor(headerFormat: string, tableEndName: string, currentCommentData?: string) {
        this.headerFormat = headerFormat;
        this.tableEndLine = Table.TABLE_END_TAG.format(tableEndName);
        if (currentCommentData) {
            this.currentCommentData = currentCommentData;
        }
        else {
            this.currentCommentData = "";
        }
        tl.debug("table already exists in comment? " + this.tableHasData());
    }

    public addHeader(target: string, percentile: number): void {
        if (!this.tableHasData()) {
            this.addTableData(this.headerFormat.format(String(percentile), target));
            let numberColumns: number = this.getNumberColumns(this.currentCommentData);
            this.addTableData(Table.NEW_LINE + Table.COLUMN_DIVIDER);
            for (let i = 0; i < numberColumns; i++) {
                this.addTableData(Table.HEADER_SYMBOL + Table.COLUMN_DIVIDER);
            }
        }
    }

    public abstract addSection(current: AbstractPipeline, currentDefinitionLink: string, target: Branch, numberPipelinesToConsiderForHealth: number, longRunningValidations: AbstractPipelineTask[], thresholdTimes: number[]): void;

    public getCurrentCommentData(): string {
        return this.currentCommentData;
    }

    protected tableHasData(): boolean {
        return this.currentCommentData.indexOf(this.tableEndLine) >= 0;
    }

    protected addTableData(data: string): void {
        if (this.tableHasData()) {
            this.currentCommentData = this.currentCommentData.replace(this.tableEndLine, data + this.tableEndLine);
        }
        else {
            if (!this.commentIsEmpty()) {
                this.currentCommentData += Table.NEW_LINE + Table.NEW_LINE;
            }
            this.currentCommentData += data + this.tableEndLine;
        }
    }

    private commentIsEmpty(): boolean {
        return !this.currentCommentData || this.currentCommentData === "";
    }

    private getNumberColumns(line: string): number {
        let numberColumns: number = -1;
        for (let char of line) {
            if (char === Table.COLUMN_DIVIDER) {
                numberColumns++;
            }
        }
        return numberColumns;
    }

}


export class FailureTable extends Table {

    constructor(currentCommentData?: string) {
        super(messages.failureCommentTableHeading, messages.failureCommentTableEndName, currentCommentData);
    }

    public addSection(current: AbstractPipeline, currentDefinitionLink: string, target: Branch, numberPipelinesToConsiderForHealth: number, longRunningValidations: AbstractPipelineTask[], thresholdTimes: number[]): void {
        if (this.tableHasData()) {
            if (current.isFailure()) {
                let messageString: string = messages.failureCommentRow;
                if (target.isHealthy(numberPipelinesToConsiderForHealth)) {
                    messageString = messages.successCommentRow;
                }
            this.addTableData(Table.NEW_LINE + messageString.format(current.getDefinitionName(), current.getLink(), target.getTruncatedName(), currentDefinitionLink));
            }
        }
    }
}

export class LongRunningValidationsTable extends Table {

    constructor(currentCommentData?: string) {
        super(messages.longRunningValidationCommentTableHeading, messages.longRunningValidationTableEndName, currentCommentData);
    }

    public addSection(current: AbstractPipeline, currentDefinitionLink: string, target: Branch, numberPipelinesToConsiderForHealth: number, longRunningValidations: AbstractPipelineTask[], thresholdTimes: number[]): void {
        if (this.tableHasData()) {
            let section: string = "";
            for (let index = 0; index < longRunningValidations.length; index++) {
                let nextLine: string = messages.longRunningValidationCommentFirstSectionRow;
                if (index > 0) {
                    nextLine = messages.longRunningValidationCommentLowerSectionRow;
                }
                let task: AbstractPipelineTask = longRunningValidations[index];
                section += Table.NEW_LINE + nextLine.format(current.getDefinitionName(), current.getLink(), task.getName(), this.formatTime(task.calculateRegression(thresholdTimes[index])), this.formatTime(thresholdTimes[index]));
            }
            this.addTableData(section);
        }
    }

    private formatTime(duration: number): string {
        return String(Math.round(duration));
    }
}