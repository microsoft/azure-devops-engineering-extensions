import { AbstractPipeline } from "./AbstractPipeline";
import tl = require('azure-pipelines-task-lib/task');
import stats from "stats-lite";
import { AbstractPipelineTask } from "./AbstractPipelineTask";
import { AbstractAzureApi } from "./AbstractAzureApi";

 

export class Branch{

    private pipelines: AbstractPipeline[]; 
    private name: string;
    private static readonly NAME_SEPERATOR = "/";

    constructor(name: string) {
        this.pipelines = [];
        this.name = name;
    }

    public async retrievePastPipelines(apiCaller: AbstractAzureApi, currentPipeline: AbstractPipeline, projectName: string, numberToRetrieve: number): Promise<void> {
        this.pipelines = await apiCaller.getMostRecentPipelinesOfCurrentType(projectName, currentPipeline, numberToRetrieve, this.name);
        tl.debug("Number of retrieved pipelines for "  + this.name + " = " + this.pipelines.length);
    }

    public isHealthy(pastPipelinesToConsider: number): boolean {
        if (this.pipelines) {
            pastPipelinesToConsider = Math.min(this.pipelines.length, pastPipelinesToConsider);
            for (let numberPipeline = 0; numberPipeline < pastPipelinesToConsider; numberPipeline++) {
                if (this.pipelines[numberPipeline].isFailure()) {
                    return false;
                }
            }
        }
        return true;
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

    public getMostRecentCompletePipeline(): AbstractPipeline | null {
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
        let truncatedName = this.name;
        let seperatedName = (truncatedName.split(Branch.NAME_SEPERATOR));
        if (seperatedName.length >= 3) {
           truncatedName =  seperatedName.slice(2).join("");
        }
        return truncatedName.charAt(0).toUpperCase() + truncatedName.slice(1);
    }

    public getPercentileTimeForPipelineTask(percentileToFind: number, task: AbstractPipelineTask): number {
        let times: number[] = this.getAllPipelineTimesForTask(task);
        tl.debug("times on target for " + task.getName() + " = " + times.toString())
        if (times.length > 0) {
            tl.debug("input for stats library " + percentileToFind / 100);
            return stats.percentile(times, percentileToFind / 100)
        }
        else {
            tl.debug("no tasks with name " + task.getName() + " found on pipelines of branch " + this.name);
            return null;
        }
    }

    private getAllPipelineTimesForTask(task: AbstractPipelineTask): number[] {
        let times: number[] = [];
        for (let pipeline of this.pipelines) {
            if (pipeline.getTask(task)) {
                times.push(pipeline.getTask(task).getDuration());
            }
        }
        return times;
    }

}
