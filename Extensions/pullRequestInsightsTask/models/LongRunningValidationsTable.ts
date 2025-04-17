import tl = require("azure-pipelines-task-lib/task");
import * as messages from "../resources/user_messages.json";
import { AbstractPipeline } from "../dataModels/AbstractPipeline";
import { PipelineTask } from "../dataModels/PipelineTask";
import { AbstractTable } from "./AbstractTable";
import { Branch } from "../dataModels/Branch";

/**
 * This class represents a table within a comment meant to display data about task regression when the
 * current pipeline has tasks that run over a threshold time
 */
declare global {
  interface String {
    format(...args: any[]): string;
  }
}
export class LongRunningValidationsTable extends AbstractTable {
  private static readonly TIME_LABELS: Map<() => number, string> = new Map([
    [Date.prototype.getUTCHours, "h"],
    [Date.prototype.getUTCMinutes, "m"],
    [Date.prototype.getUTCSeconds, "s"]
  ]);

  constructor(currentCommentData?: string) {
    super(
      messages.longRunningValidationCommentTableHeading,
      messages.longRunningValidationTableEndName,
      currentCommentData
    );
  }

  public addSection(
    current: AbstractPipeline,
    currentDefinitionLink: string,
    target: Branch,
    numberPipelinesToConsiderForHealth: number,
    longRunningValidations: PipelineTask[]
  ): void {
    if (this.tableHasData()) {
      let section: string = "";
      for (let index = 0; index < longRunningValidations.length; index++) {
        let nextLine: string =
          messages.longRunningValidationCommentFirstSectionRow;
        if (index > 0) {
          nextLine = messages.longRunningValidationCommentLowerSectionRow;
        }
        const validation: PipelineTask = longRunningValidations[index];
        let nameText: string = validation.getName();
        let durationWithRegressionText: string = this.formatDurationWithRegression(
          validation.getLongestRegressiveDuration(),
          validation.getLongestRegression()
        );
        if (validation.getNumberOfAgentsRegressedOn() > 1) {
          nameText += this.formatMultiAgentLine(
            validation.getNumberOfAgentsRegressedOn(),
            validation.getNumberOfAgentsRunOn()
          );
        }
        if (
          this.formatMillisecondsAsTime(validation.getShortestRegression()) !==
          this.formatMillisecondsAsTime(validation.getLongestRegression())
        ) {
          durationWithRegressionText = messages.durationRangeFormat.format(
            this.formatDurationWithRegression(
              validation.getShortestRegressiveDuration(),
              validation.getShortestRegression()
            ),
            durationWithRegressionText
          );
        }
        console.log(
          "adding long running task: " +
            validation.getName() +
            " And task has duration/regression of " +
            durationWithRegressionText
        );
        section +=
          AbstractTable.NEW_LINE +
          nextLine.format(
            current.getDefinitionName(),
            current.getLink(),
            nameText,
            durationWithRegressionText
          );
      }
      this.addTextToTableInComment(section);
    }
  }

  /**
   * Formats multiagent regression line
   * @param agentsRegressedOn Number of agents task regressed on
   * @param agentsRunOn Total number of agents task ran on
   */
  private formatMultiAgentLine(
    agentsRegressedOn: number,
    agentsRunOn: number
  ): string {
    return (
      messages.inLineBreak +
      messages.smallText.format(
        messages.longRunningMultiAgentLine.format(
          String(agentsRegressedOn),
          String(agentsRunOn)
        )
      )
    );
  }

  /**
   * Formats duration and regression in milliseconds into display
   * @param duration Amount of time task took in milliseconds
   * @param regression Amount of time task regressed in milliseconds
   */
  private formatDurationWithRegression(
    duration: number,
    regression: number
  ): string {
    return messages.durationWithRegressionFormat.format(
      this.formatMillisecondsAsTime(duration),
      this.formatMillisecondsAsTime(regression)
    );
  }

  /**
   * Formats a time in milliseconds into hours, minutes, seconds
   * @param timeInMilliseconds Amount of time to format
   */
  private formatMillisecondsAsTime(timeInMilliseconds: number): string {
    let formattedTime: string = "";
    const date: Date = new Date(
      this.roundMillisecondsToSeconds(timeInMilliseconds)
    );
    LongRunningValidationsTable.TIME_LABELS.forEach(
      (value: string, key: () => number) => {
        if (key.call(date) > 0) {
          formattedTime += key.call(date) + value + " ";
        }
      }
    );
    tl.debug("time to put in table: " + formattedTime);
    return formattedTime.trim();
  }

  /**
   * Rounds number of milliseconds to the closest second
   * @param milliseconds Number of milliseconds to round
   */
  private roundMillisecondsToSeconds(milliseconds: number): number {
    return 1000 * Math.round(milliseconds / 1000);
  }
}
