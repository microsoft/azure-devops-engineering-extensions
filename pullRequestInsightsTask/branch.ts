import { IPipeline } from "./IPipeline";
import tl = require('azure-pipelines-task-lib/task');
import stats from "stats-lite";
import { IPipelineTask, BuildTask } from "./PipelineTask";

 

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

    public getFullName(): string{
        return this.name;
    }

    public getTruncatedName(): string{
        let seperatedName = this.name.split(Branch.NAME_SEPERATOR);
        return seperatedName.slice(2).join("");
    }

    public getPercentileTimesForPipelineTasks(percentileToFind: number, tasks: IPipelineTask[]): number[] {
        let percentileTimesForTasks: number[] = [];
        for (let task of tasks) {
            let times: number[] = [];
            for (let pipeline of this.pipelines) {
                if (pipeline.getTask(task)){
                    times.push(pipeline.getTask(task).getDuration());
            } 
        }
        tl.debug("times on target for " + task.getName() + " = " + times.toString())
        if (times.length > 0) {
            tl.debug("input for stats library " + percentileToFind/100);
            percentileTimesForTasks.push(stats.percentile(times, percentileToFind/100));
        }
        else {
            percentileTimesForTasks.push(null);
            tl.debug("no tasks with name " + task.getName() +  "found on pipelines of branch " + this.name);
        }
    }
    return percentileTimesForTasks;
    }

}
