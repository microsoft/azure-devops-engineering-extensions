import { AzureApiFactory } from "./AzureApiFactory";
import messages from './user_messages.json';
import { IPipeline } from "./IPipeline";

export abstract class Table {

    private currentData: string;
    private tableHeaderFormat: string;

    constructor(tableHeaderFormat: string, currentData?: string) {
        this.tableHeaderFormat = tableHeaderFormat;
        if (currentData) {
            this.currentData = currentData;
        }
        else {
            this.currentData = "";
        }
    }

    abstract addHeader(): void;

    abstract addSection(): void;

    public getTableAsString(): string {
        return this.currentData;
    }

    public tableHasData(): boolean {
        return this.currentData.length > 0;
    }

    protected checkForAdditionalHeaderColumns(type: string, current: string): string {
        return this.addExtraInformationToRow(type, messages.releaseHeaderColumn, 0, current);
    }

    protected checkForAdditionalRowColumns(type: string, current: string, pipeline: IPipeline): string {
        return this.addExtraInformationToRow(type, messages.releaseRowColumn.format(String(pipeline.getDefinitionId())), 0, current);
    }

    private addExtraInformationToRow(type: string, information: string, index: number, current: string): string {
        if (type === AzureApiFactory.RELEASE) {
            return current.slice(0, index) + information + current.slice(index, current.length);
        }
        return current;
    }

}