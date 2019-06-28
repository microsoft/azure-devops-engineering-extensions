import { AzureApiFactory } from "./AzureApiFactory";
import messages from './user_messages.json';
import { IPipeline } from "./IPipeline";
import { Branch } from "./branch";
import './StringExtensions';
import { IPipelineTask } from "./IPipelineTask";

export abstract class Table {

    private currentData: string;
    private headerFormat: string;
    public static readonly NEW_LINE = "\n";
    public static readonly COLUMN_DIVIDER = "|";
    public static readonly HEADER_SYMBOL = "---";

    constructor(headerFormat: string, currentData?: string) {
        this.headerFormat = headerFormat;
        if (currentData) {
            this.currentData = currentData;
        }
        else {
            this.currentData = "";
        }
    }

    public addHeader(target: string, percentile: number): void {
        if (!this.tableHasData()) {
            this.addTableData(this.headerFormat.format(String(percentile), target));
            let numberColumns: number = this.getNumberColumns(this.currentData);
            this.addTableData(Table.NEW_LINE + Table.COLUMN_DIVIDER);
            for (let i = 0; i < numberColumns; i++) {
                this.addTableData(Table.HEADER_SYMBOL + Table.COLUMN_DIVIDER);
            }
        }
    }

    public abstract addSection(current: IPipeline, currentDefinitionLink: string, mostRecent: IPipeline, target: Branch, longRunningValidations: IPipelineTask[], thresholdTimes: number[]): void;

    public getTableAsString(): string {
        return this.currentData;
    }

    public tableHasData(): boolean {
        return this.currentData.length > 0;
    }

    protected addTableData(data: string): void {
        this.currentData += data;
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

    constructor(currentData?: string) {
        super(messages.failureCommentTableHeading, currentData);
    }

    public addSection(current: IPipeline, currentDefinitionLink: string, mostRecent: IPipeline, target: Branch, longRunningValidations: IPipelineTask[], thresholdTimes: number[]): void {
        if (this.tableHasData()) {
            let messageString = messages.successCommentRow;
            if (mostRecent.isFailure()) {
                messageString = messages.failureCommentRow;
            }
            messageString = messageString.format(current.getDefinitionName(), current.getLink(), target.getTruncatedName(), currentDefinitionLink);
            this.addTableData(Table.NEW_LINE + messageString);
        }
    }
}

export class LongRunningValidationsTable extends Table {

    constructor(currentData?: string) {
        super(messages.longRunningValidationCommentTableHeading, currentData);
    }

    public addSection(current: IPipeline, currentDefinitionLink: string, mostRecent: IPipeline, target: Branch, longRunningValidations: IPipelineTask[], thresholdTimes: number[]): void {
        if (this.tableHasData()) {
            for (let index = 0; index < longRunningValidations.length; index++) {
                let taskName: string = longRunningValidations[index].getName();
                let messageString: string = messages.longRunningValidationCommentFirstSectionRow;
                if (index > 0) {
                    messageString = messages.longRunningValidationCommentLowerSectionRow;
                }
                messageString = messageString.format(current.getDisplayName(), taskName, String(longRunningValidations[index].getDuration()), String(thresholdTimes[index]), mostRecent.getDisplayName(), mostRecent.getLink());
                this.addTableData(Table.NEW_LINE + messageString);
            }
        }
    }
}