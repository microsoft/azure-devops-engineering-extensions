import { AzureApiFactory } from "./AzureApiFactory";
import messages from './user_messages.json';
import { IPipeline } from "./IPipeline";
import { Branch } from "./branch";
import './StringExtensions';

export abstract class Table {

    private currentData: string;
    private headerFormat: string;
    private pipelineType: string;
    public static readonly NEW_LINE = "\n";
    public static readonly COLUMN_DIVIDER = "|";
    public static readonly HEADER_SYMBOL = "---";

    constructor(headerFormat: string, pipelineType: string, currentData?: string) {
        this.headerFormat = headerFormat;
        this.pipelineType = pipelineType;
        if (currentData) {
            this.currentData = currentData;
        }
        else {
            this.currentData = "";
        }
    }

    public addHeader(target: string, percentile: number): void {
        if (!this.tableHasData()) {
            this.addTableData(this.editHeaderColumnForPipelineType(this.headerFormat.format(String(percentile), target)));
            let numberColumns: number = this.getNumberColumns(this.currentData);
            this.addTableData(Table.NEW_LINE + Table.COLUMN_DIVIDER);
            for (let i = 0; i < numberColumns; i++) {
                this.addTableData(Table.HEADER_SYMBOL + Table.COLUMN_DIVIDER);
            }
        }
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

    public abstract addSection(current: IPipeline, mostRecent: IPipeline, target: Branch, type: string, thresholdTimes: Map<string, number>): void;

    public getTableAsString(): string {
        return this.currentData;
    }

    public tableHasData(): boolean {
        return this.currentData.length > 0;
    }

    protected addTableData(data: string): void {
        this.currentData += data;
    }

    protected editHeaderColumnForPipelineType(current: string): string {
        return this.addExtraInformationToRow(messages.releaseHeaderColumn, 0, current);
    }

    protected editRowForPipelineType(current: string, pipeline: IPipeline): string {
        return this.addExtraInformationToRow(messages.releaseRowColumn.format(String(pipeline.getDefinitionId())), 0, current);
    }

    private addExtraInformationToRow(informationToAdd: string, index: number, current: string): string {
        if (this.pipelineType === AzureApiFactory.RELEASE) {
            return current.slice(0, index) + informationToAdd + current.slice(index, current.length);
        }
        return current;
    }

}


export class FailureTable extends Table {

    constructor(pipelineType: string, currentData?: string) {
        super(messages.failureCommentTableHeading, pipelineType, currentData);
    }

    public addSection(current: IPipeline, mostRecent: IPipeline, target: Branch, type: string, thresholdTimes: Map<string, number>): void {
        if (this.tableHasData()) {
            let messageString = messages.successCommentRow;
            if (mostRecent.isFailure()) {
                messageString = messages.failureCommentRow;
            }
            this.addTableData(Table.NEW_LINE + messageString.format(current.getDisplayName(), current.getLink(), String(target.getPipelineFailStreak()), target.getTruncatedName(), type, mostRecent.getDisplayName(), mostRecent.getLink()));
        }
    }
}

export class LongRunningValidationsTable extends Table {

    constructor(pipelineType: string,currentData?: string) {
        super(messages.longRunningValidationCommentTableHeading, pipelineType, currentData);
    }

    public addSection(current: IPipeline, mostRecent: IPipeline, target: Branch, type: string, thresholdTimes: Map<string, number>): void {
        if (this.tableHasData()) {
            let longRunningValidations: Map<string, number> = current.getLongRunningValidations(thresholdTimes);
            for (let index = 0; index < longRunningValidations.size; index++) {
                let taskId: string = Array.from(longRunningValidations.keys())[index];
                let messageString: string = messages.longRunningValidationCommentFirstSectionRow;
                if (index > 0) {
                    messageString = messages.longRunningValidationCommentLowerSectionRow;
                }
                this.addTableData(Table.NEW_LINE + messageString.format(taskId, String(longRunningValidations.get(taskId)), String(thresholdTimes.get(taskId))));
            }
        }
    }
}