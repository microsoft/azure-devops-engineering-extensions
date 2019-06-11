import messages from "./user_messages.json"
import './StringExtensions';


export class CommentFactory {
   
    public createHeader(buildIteration: string): string{
        return messages.failureCommentHeading.format(buildIteration);
    }

    public createRow(isFailure: boolean, pipelineDisplayName: string, pipelineLink: string, pipelineFailStreak: string, targetName: string, type: string, recentFailedPipelineName: string, recentFailedPipelineLink: string): string {
        if (isFailure){
            return messages.failureCommentRow.format(pipelineDisplayName, pipelineLink, pipelineFailStreak, targetName, type, targetName, recentFailedPipelineName, recentFailedPipelineLink);
        }
        return messages.successCommentRow.format(pipelineDisplayName, pipelineLink, targetName, type);
    }
}
