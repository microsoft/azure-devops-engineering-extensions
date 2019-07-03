import { AbstractPipelineTask } from "./AbstractPipelineTask";
import { AbstractAzureApi } from "./AbstractAzureApi";

export abstract class AbstractPipeline{

    private tasks: AbstractPipelineTask[];
    
    constructor() {
        
    }

    protected setTasks(tasks: AbstractPipelineTask[]): void {
        this.tasks = tasks;
    }

    public abstract getDefinitionId(): number;
    public abstract getDefinitionName(): string;
    public abstract getDefinitionLink(apiCaller: AbstractAzureApi, project: string):Promise<string>;
    public abstract isFailure(): boolean;
    public abstract isComplete(): boolean;
    public abstract getLink(): string;
    public abstract getId(): number;
    public abstract getDisplayName(): string;
   

    public getTasks(): AbstractPipelineTask[] { 
        if (!this.tasks) {
            return null;
        }
        return this.tasks;
    }

    public getTask(taskToGet: AbstractPipelineTask): AbstractPipelineTask { 
        if (this.tasks) {
            for (let task of this.tasks) {
                if (task.equals(taskToGet)) {
                    return task;
                }
            }
        }
        return null;
    }

    protected taskFailedDuringRun(): boolean {
        for (let task of this.getTasks()){
            if (task.ran() && task.wasFailure()){
                return true;
            }
        }
        return false;
    }
}

