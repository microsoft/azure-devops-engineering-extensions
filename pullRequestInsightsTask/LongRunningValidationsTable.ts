import tl = require('azure-pipelines-task-lib/task');
import messages from './user_messages.json';
import { AbstractTable } from './AbstractTable.js';
import { AbstractPipeline } from './AbstractPipeline.js';
import { Branch } from './Branch.js';
import { LongRunningValidation } from './LongRunningValidation.js';

export class LongRunningValidationsTable extends AbstractTable {
    
    private static readonly TIME_LABELS: Map<() => number, string> = new Map([[Date.prototype.getUTCHours, "h"], [Date.prototype.getUTCMinutes, "m"], [Date.prototype.getUTCSeconds, "s"]]);

    constructor(currentCommentData?: string) {
        super(messages.longRunningValidationCommentTableHeading, messages.longRunningValidationTableEndName, currentCommentData);
    }

    public addSection(current: AbstractPipeline, currentDefinitionLink: string, target: Branch, numberPipelinesToConsiderForHealth: number, longRunningValidations: LongRunningValidation[]): void {
        if (this.tableHasData()) {
            let section: string = "";
            for (let index = 0; index < longRunningValidations.length; index++) {
                let nextLine: string = messages.longRunningValidationCommentFirstSectionRow;
                if (index > 0) {
                    nextLine = messages.longRunningValidationCommentLowerSectionRow;
                }
                let validation: LongRunningValidation = longRunningValidations[index];
                let nameText: string = validation.getName();
                let durationWithRegressionText: string = this.formatDurationWithRegression(validation.getLongestTaskInstanceDuration(), validation.getLongestTaskInstanceRegression());
                if (validation.hasInstancesOnMultipleAgents()) {
                    nameText += messages.longRunningMultiAgentLine.format(String(validation.getNumberOfAgentsRunOn()));
                    durationWithRegressionText = messages.durationRangeFormat.format(durationWithRegressionText, this.formatDurationWithRegression(validation.getShortestTaskInstanceDuration(), validation.getShortestTaskInstanceRegression()));
                }
                tl.debug("adding long running task: " + validation.getName() + " And task has duration/regression of " + durationWithRegressionText);
                section += AbstractTable.NEW_LINE + nextLine.format(current.getDefinitionName(), current.getLink(), nameText, durationWithRegressionText);
            }
            this.addTextToTableInComment(section);
        }
    }

    private formatDurationWithRegression(duration: number, regression: number): string {
        return messages.durationWithRegressionFormat.format(this.formatMillisecondsAsTime(duration), this.formatMillisecondsAsTime(regression));
    }

    private formatMillisecondsAsTime(duration: number): string {
        let formattedTime: string = "";
        let date: Date = new Date(this.roundMillisecondsToSeconds(duration));
        LongRunningValidationsTable.TIME_LABELS.forEach((value: string, key: () => number) => {
            if (key.call(date) > 0) {
                formattedTime += key.call(date) + value + " ";
            }
        });
        tl.debug("time to put in table: " + formattedTime);
        return formattedTime.trim();
    }

    private roundMillisecondsToSeconds(milliseconds: number): number {
        return 1000 * Math.round(milliseconds / 1000);
    }

}