import { IPipeline } from "./IPipeline";
import tl = require('azure-pipelines-task-lib/task');
import stats from "stats-lite";
 

export class Branch{

    private pipelines: IPipeline[]; 
    private name: string;
    private static readonly NAME_SEPERATOR = "/";

    constructor(name: string, pipelines: IPipeline[]) {
        this.pipelines = pipelines;
        this.name = name;
    }

    public getPipelineFailStreak(): number {
        let count: number = 0;
        for (let numberPipeline = 0; numberPipeline < this.pipelines.length; numberPipeline++) {
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

    public getMostRecentCompletePipeline(): IPipeline | null {
       for (let pipeline of this.pipelines) {
           if (pipeline.isComplete()){
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

    public getPercentileTimesForPipelineTasks(percentileToFind: number, taskIds: string[]): Map<string, number> {
        let percentileTimesForTasks: Map<string, number> = new Map();
        for (let taskId of taskIds) {
            let times: number[] = [];
            for (let pipeline of this.pipelines) {
                let taskLength: number = pipeline.getTaskLength(taskId);
                if (taskLength) {
                    times.push(taskLength);
                } 
            }
        if (times.length > 0) {
            percentileTimesForTasks.set(taskId, stats.percentile(times, percentileToFind));
        }
        else {
            tl.debug(`no tasks with id ${taskId} found on pipelines of branch ${this.name}`);
        }
    }
    return percentileTimesForTasks;
    }
}
