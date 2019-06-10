import { IPipeline } from "./IPipeline";
import tl = require('azure-pipelines-task-lib/task');

export class Branch{

    private pipelines: IPipeline[]; 
    private name: string;
    private static readonly NAME_SEPERATOR = "/";

    constructor(name: string, pipelines: IPipeline[]){
        this.pipelines = pipelines;
        this.name = name;
    }

    public getPipelineFailStreak(): number{
        let count: number = 0;
        for (let numberPipeline = 0; numberPipeline < this.pipelines.length; numberPipeline++){
            if (this.pipelines[numberPipeline].isFailure()){
                count++;
            }
            else if (this.pipelines[numberPipeline].isComplete()){
                break;
            }
        }
        tl.debug(`number pipelines failing on ${this.name} is ${count}`)
        return count;
    }

    public getMostRecentFailedPipeline(): IPipeline | null{
        for (let pipeline of this.pipelines){
           if (pipeline.isFailure()){
                return pipeline; 
            }
        }
        return null;
    }

    public tooManyPipelinesFailed(failureThreshold: number): boolean {
        return this.getPipelineFailStreak() >= failureThreshold;
    }

    public getFullName(): string{
        return this.name;
    }

    public getTruncatedName(): string{
        let seperatedName = this.name.split(Branch.NAME_SEPERATOR);
        return seperatedName.slice(2).join("");
    }

}
