import tl = require('azure-pipelines-task-lib/task');
import messages from './user_messages.json';
import { AbstractTable } from './AbstractTable.js';
import { AbstractPipeline } from './AbstractPipeline.js';
import { Branch } from './Branch.js';
import { AbstractPipelineTask } from './AbstractPipelineTask.js';

export class LongRunningValidationsTable extends AbstractTable {
    
    private static readonly TIME_LABELS: Map<() => number, string> = new Map([[Date.prototype.getUTCHours, "h"], [Date.prototype.getUTCMinutes, "m"], [Date.prototype.getUTCSeconds, "s"], [Date.prototype.getUTCMilliseconds, "ms"]]);

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
                tl.debug("adding long running task: " + task.getName());
                tl.debug(task.getName() + " has duration of " + task.getDuration() + " ms and regression is " + task.calculateRegression(thresholdTimes[index]) + " ms based on threshold time of " + thresholdTimes[index] + " ms");
                section += AbstractTable.NEW_LINE + nextLine.format(current.getDefinitionName(), current.getLink(), task.getName(), this.formatTime(task.getDuration()), this.formatTime(task.calculateRegression(thresholdTimes[index])));
            }
            this.addTableDataToCurrentComment(section);
        }
    }

    private formatTime(duration: number): string {
        let formattedTime: string = "";
        let date: Date = new Date(Math.round(duration));
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