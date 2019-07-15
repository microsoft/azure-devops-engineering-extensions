import { AbstractPipeline } from "./AbstractPipeline";
import tl = require('azure-pipelines-task-lib/task');
import stats from "stats-lite";
import { AbstractPipelineTask } from "./AbstractPipelineTask";

export class Branch{

    private pipelines: AbstractPipeline[]; 
    private name: string;
    private static readonly NAME_SEPERATOR = "/";

    constructor(name: string, pipelines?: AbstractPipeline[]) {
        this.pipelines = [];
        if (pipelines) {
            this.setPipelines(pipelines);
        }
        this.name = name;
    }

    public setPipelines(pipelines: AbstractPipeline[]): void {
        this.pipelines = pipelines;
        tl.debug("Number of retrieved pipelines for "  + this.name + " = " + this.pipelines.length);
    }

    public isHealthy(numberPipelinesToConsider: number): boolean {
        let pipelinesToConsider: AbstractPipeline[] = [];
        if (this.pipelines) {
            for (let pipeline of this.pipelines) {
                if (pipeline.isComplete()) {
                    pipelinesToConsider.push(pipeline);
            }
            else {
                tl.debug("not considering the health of " + pipeline.getDisplayName() + " because it is not complete");
            }
        }
            numberPipelinesToConsider = Math.min(pipelinesToConsider.length, numberPipelinesToConsider);
            for (let numberPipeline = 0; numberPipeline < numberPipelinesToConsider; numberPipeline++) {
                tl.debug("considering pipeline " + pipelinesToConsider[numberPipeline].getDisplayName());
                tl.debug(pipelinesToConsider[numberPipeline].getDisplayName() + " is a failure? " + pipelinesToConsider[numberPipeline].isFailure());
                if (pipelinesToConsider[numberPipeline].isFailure()) {
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

    public getFullName(): string {
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
            let taskOnPipeline = pipeline.getTask(task);
            if (taskOnPipeline && taskOnPipeline.getDuration()) {
                times.push(taskOnPipeline.getDuration());
            }
        }
        return times;
    }

}
