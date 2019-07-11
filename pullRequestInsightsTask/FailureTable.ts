import { AbstractTable } from "./AbstractTable";
import { AbstractPipeline } from "./AbstractPipeline";
import { Branch } from "./Branch";
import { AbstractPipelineTask } from "./AbstractPipelineTask";
import tl = require('azure-pipelines-task-lib/task');
import messages from './user_messages.json';

export class FailureTable extends AbstractTable {

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
            this.addTableDataToCurrentComment(AbstractTable.NEW_LINE + messageString.format(current.getDefinitionName(), current.getLink(), target.getTruncatedName(), currentDefinitionLink));
            }
        }
    }
}