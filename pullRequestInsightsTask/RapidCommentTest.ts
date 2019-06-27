import { AbstractAzureApi } from "./AbstractAzureApi";
import { PullRequest } from "./PullRequest";

export class RapidCommentTest {

    private apiCaller: AbstractAzureApi;


    constructor(apiCaller: AbstractAzureApi) {
       this.apiCaller = apiCaller;
    }

    public async test(): Promise<void> {
        for (let i = 0; i < 20; i++) {
            let comment =  await this.apiCaller.getComment(10, "myepsteam", "myepsteam", 1378, 1);
            this.apiCaller.updateComment({content: comment.content + "\n" + String(i)}, 10, "myepsteam", "myepsteam", 1378, 1);
        }
    }
}