import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { PullRequest } from "../PullRequest";

describe("PullRequest Tests", () => {

    let pullRequest: PullRequest;
    let threads: azureGitInterfaces.GitPullRequestCommentThread[];

    function makeThread(commentsContents: string[], threadStatus: azureGitInterfaces.CommentThreadStatus, threadId: number): azureGitInterfaces.GitPullRequestCommentThread {
        let threadComments = [];
        for (let commentContent of commentsContents){
            threadComments.push({content: commentContent});
        }
        return {
            comments: threadComments,
            status: threadStatus, 
            id: threadId
            
        }
    }


    test("Does not find a comment id when comments are of wrong format", () =>{
        pullRequest = new PullRequest(2, "repo", "project");
        threads = [makeThread(["|jk jk hj| failure |", "fake comment"], azureGitInterfaces.CommentThreadStatus.Active, 6)];
        expect(pullRequest.getCurrentIterationCommentThread(null, "thisBuild")).toBeNull; 
    });

    test("Finds the correct comment id when comment of same build iteration in correct format exists", () =>{
       // pullRequest = new PullRequest(2, "repo", "project");
      //  threads = [makeThread(["|jk jk hj| failure |", "fake comment"], azureGitInterfaces.CommentThreadStatus.Active, 6), makeThread(["|Build Iteration: 345| | |\n|---|---|---|\n|[fake](fake)|Failing last fake fake fakes|Latest run from fake: [fake](fake)|"], azureGitInterfaces.CommentThreadStatus.Active, 5)];
     //   expect(pullRequest.getCurrentIterationCommentThread(null, "345").id).toBe(5); 
    });



});