import messages from "./user_messages.json"
import './StringExtensions';
import { AbstractPipeline } from "./AbstractPipeline.js";
import { Branch } from "./Branch.js";
import { AbstractPipelineTask } from "./AbstractPipelineTask.js";


export class CommentContentFactory {
   
    public createIterationHeader(buildIteration: string): string{
        return messages.newIterationCommentHeading.format(buildIteration);
    }

    public createTableHeader(isFailure: boolean, targetBranchName: string, percentile: string): string {
        if (isFailure) {
            return messages.failureCommentTableHeading.format(percentile, targetBranchName);
        }
        return messages.longRunningValidationCommentTableHeading.format(percentile, targetBranchName);
    }

    public createTableSection(current: AbstractPipeline, currentDefinitionLink: string, mostRecent: AbstractPipeline, target: Branch, numberPipelinesToConsiderForHealth: number, longRunningValidations: AbstractPipelineTask[], thresholdTimes: number[]): string {
        if (current.isFailure()) {
            let messageString: string = messages.failureCommentRow;
            if (target.isHealthy(numberPipelinesToConsiderForHealth)) {
                messageString = messages.successCommentRow;
        }
        return messageString.format(current.getDefinitionName(), current.getLink(), target.getTruncatedName(), currentDefinitionLink);
        }
        let section: string;
        for (let index = 0; index < longRunningValidations.length; index++) {
            if (index == 0) {
                section = messages.longRunningValidationCommentFirstSectionRow.format(current.getDisplayName(), current.getLink(), longRunningValidations[index].getName(), String(longRunningValidations[index].getDuration()), String(thresholdTimes[index]), mostRecent.getDisplayName(), mostRecent.getLink());
            }
            else {
                section += "\n" + messages.longRunningValidationCommentLowerSectionRow.format(longRunningValidations[index].getName(), String(longRunningValidations[index].getDuration()), String(thresholdTimes[index]));
            }
        }
        return section;
    }
}
