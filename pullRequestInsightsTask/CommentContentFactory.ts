import messages from "./user_messages.json"
import './StringExtensions';
import { IPipeline } from "./IPipeline.js";
import { Branch } from "./Branch.js";
import { IPipelineTask } from "./IPipelineTask.js";


export class CommentContentFactory {

    static readonly PLACE_HOLDER: string = "https://www.google.com/"; // temporary
   
    public createIterationHeader(buildIteration: string): string{
        return messages.newIterationCommentHeading.format(buildIteration);
    }

    public createTableHeader(isFailure: boolean, targetBranchName: string, percentile: string): string {
        if (isFailure) {
            return messages.failureCommentTableHeading.format(percentile, targetBranchName);
        }
        return messages.longRunningValidationCommentTableHeading.format(percentile, targetBranchName);
    }

    public createTableSection(current: IPipeline, mostRecent: IPipeline, target: Branch, type: string, longRunningValidations: IPipelineTask[], thresholdTimes: number[]): string {
        if (current.isFailure()) {
            let messageString: string = messages.successCommentRow;
            if (mostRecent.isFailure()) {
                messageString = messages.failureCommentRow;
        }
        return messageString.format(current.getDefinitionName(), CommentContentFactory.PLACE_HOLDER, current.getDisplayName(), current.getLink(), target.getTruncatedName(), CommentContentFactory.PLACE_HOLDER, CommentContentFactory.PLACE_HOLDER);
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
