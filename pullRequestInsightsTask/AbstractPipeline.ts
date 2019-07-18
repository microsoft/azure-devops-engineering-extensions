import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import { AbstractAzureApi } from "./AbstractAzureApi";
import { PipelineTask } from "./PipelineTask";
import tl = require('azure-pipelines-task-lib/task');

export abstract class AbstractPipeline{

    private tasks: PipelineTask[];

    constructor() {
        this.tasks = [];
    }

    protected addTasks(allTaskRuns: AbstractPipelineTaskRun[]): void {
        for (let taskRun of allTaskRuns) {
            let task: PipelineTask = this.getTask(taskRun.getName(), taskRun.getId(), taskRun.getType());
            if (!task) {
                task = new PipelineTask(taskRun.getName(), taskRun.getId(), taskRun.getType());
                this.tasks.push(task);
            }
            task.addTaskInstance(taskRun);
        }
    }

    public abstract getDefinitionId(): number;

    public abstract getDefinitionName(): string;

    public abstract getDefinitionLink(apiCaller: AbstractAzureApi, project: string):Promise<string>;

    public abstract isFailure(): boolean;

    public abstract isComplete(): boolean;

    public abstract getLink(): string;

    public abstract getId(): number;

    public abstract getDisplayName(): string;


    public getTasks(): PipelineTask[] {
        if (!this.tasks) {
            return [];
        }
        return this.tasks;
    }

    public getTask(name: string, id: string, type: string): PipelineTask {
        for (let task of this.getTasks()) {
            tl.debug("feeding in type: " + type)
            if (task.isMatchingTask(name, id, type)) {
                return task;
            }
        }
        return null;
    }
 

    protected taskFailedDuringRun(): boolean {
        for (let task of this.getTasks()){
            if (task.hasFailedInstance()){
                return true;
            }
        }
        return false;
    }

}

