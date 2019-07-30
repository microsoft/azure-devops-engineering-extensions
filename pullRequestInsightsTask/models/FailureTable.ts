import { AbstractTable } from "./AbstractTable";
import messages from "../resources/user_messages.json";
import { Branch } from "../dataModels/Branch";
import { PipelineTask } from "../dataModels/PipelineTask";
import { AbstractPipeline } from "../dataModels/AbstractPipeline";
import tl = require("azure-pipelines-task-lib/task");

export class FailureTable extends AbstractTable {
  constructor(currentCommentData?: string) {
    super(
      messages.failureCommentTableHeading,
      messages.failureCommentTableEndName,
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
      const messageString: string = messages.failureTableRow;
      let statusColumn: string = "";
      for (const pipelineToConsider of target.getCompletePipelines(
        numberPipelinesToConsiderForHealth
      )) {
        let symbolToAdd = messages.success;
        tl.debug(
          "using pipeline for failure table: " +
            pipelineToConsider.toString()
        );
        if (pipelineToConsider.isFailure()) {
          symbolToAdd = messages.failure;
        }
        statusColumn += messages.link.format(
          symbolToAdd,
          pipelineToConsider.getLink()
        );
      }
      let insightsColumn = messages[
        target.getStatus(numberPipelinesToConsiderForHealth)
      ].format(target.getTruncatedName(), currentDefinitionLink);
      if (statusColumn.length === 0) {
        statusColumn = messages.noPipelines;
        insightsColumn = "";
      }

      this.addTextToTableInComment(
        AbstractTable.NEW_LINE +
          messageString.format(
            current.getDefinitionName(),
            current.getLink(),
            statusColumn,
            insightsColumn
          )
      );
    }
  }
}
