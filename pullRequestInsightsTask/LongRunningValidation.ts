import { AbstractPipelineTask } from "./AbstractPipelineTask";
import tl = require('azure-pipelines-task-lib/task');

export class LongRunningValidation {

    private name: string;
    private id: string;
    private thresholdTime: number;
    private taskInstances: AbstractPipelineTask[];
    private durationsToRegressions: Map<number, number>;

    constructor(validationName: string, validationId: string, thresholdTime: number) {
        this.name = validationName;
        this.id = validationId;
        this.taskInstances = [];
        this.thresholdTime = thresholdTime;
        this.durationsToRegressions = new Map<number, number>();
    }

    public getName(): string {
        return this.name;
    }

    public getId(): string {
        return this.id;
    }

    public addTaskInstance(taskInstanceToAdd: AbstractPipelineTask) {
        if (this.taskShouldBeAdded(taskInstanceToAdd)) {
            tl.debug("added task instance from agent " + taskInstanceToAdd.getAgentName() + " to long running validation " + this.name);
            this.taskInstances.push(taskInstanceToAdd);
            this.durationsToRegressions.set(taskInstanceToAdd.getDuration(), taskInstanceToAdd.calculateRegression(this.thresholdTime));
        }
    }

    public getLongestTaskInstanceDuration(): number {
        return Math.max(...this.getAllInstanceDurations());
    }

    public getShortestTaskInstanceDuration(): number {
        return Math.min(...this.getAllInstanceDurations());
    }

    public getLongestTaskInstanceRegression(): number {
        return this.durationsToRegressions.get(this.getLongestTaskInstanceDuration());
    }

    public getShortestTaskInstanceRegression(): number {
        return this.durationsToRegressions.get(this.getShortestTaskInstanceDuration());
    }

    public getNumberOfAgentsRunOn(): number {
        let agents: Set<string> = new Set();
        for (let task of this.taskInstances) {
            agents.add(task.getAgentName());
        }
        return agents.size;
    }

    public hasInstancesOnMultipleAgents(): boolean {
        return this.getNumberOfAgentsRunOn() > 1;
    }

    public hasMultipleTaskInstances(): boolean {
        return this.taskInstances.length > 1;
    }

    private getAllInstanceDurations(): number[] {
        return Array.from(this.durationsToRegressions.keys());
    }

    private taskShouldBeAdded(taskInstanceToAdd: AbstractPipelineTask): boolean {
        return taskInstanceToAdd.isInstanceOfTask(this.name, this.id)
    } 


}