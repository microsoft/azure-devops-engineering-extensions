import tl = require('azure-pipelines-task-lib/task');
import { ITaskReference } from './ITaskReference';

export abstract class AbstractPipelineTask {

    private name: string
    private id: string
    private type: string
    private startTime: Date
    private finishTime: Date
    private agentName: string;
   
    constructor(taskReference: ITaskReference, name: string, startTime: Date, finishTime: Date, agentName: string) {
        this.name = name
        this.id = null;
        this.type = null;
        this.startTime = startTime;
        this.finishTime = finishTime;
        this.agentName = agentName;
        if (taskReference) {
            this.id = taskReference.id;
            this.type = taskReference.name;
        }
    }

    protected abstract hasCompleteStatus(): boolean;

    public abstract wasFailure(): boolean;

    public getName(): string {
        return this.name;
    } 

    public getId(): string {
        return this.id;
    } 

    public getAgentName(): string {
        return this.agentName;
    }

    public isInstanceOfTask(nameToCompare: string, idToCompare: string): boolean {
        return this.getName() === nameToCompare && this.getId() === idToCompare;
    }

    public isLongRunning(thresholdTime: number, minimumDurationMiliseconds: number, minimumRegressionMilliseconds: number): boolean {
        let taskLength = this.getDuration();
        tl.debug("For long running calculation for task: " + this.getName() + " : " + this.getId() + " threshold time = " + thresholdTime + " minDuration = " + minimumDurationMiliseconds + " minRegression = " + minimumRegressionMilliseconds + " duration = " + taskLength + " regression = " + this.calculateRegression(thresholdTime));
        if (thresholdTime && taskLength && this.getDuration() > minimumDurationMiliseconds && this.hasSignificantRegression(thresholdTime, minimumRegressionMilliseconds)) {
            return true;
        }
        return false;
    }

    public getDuration(): number {
        if (this.ran()) {
            return this.getTimeFromDate(this.finishTime) - this.getTimeFromDate(this.startTime);
        }
        return null;
    }

    public ran(): boolean {
        return (this.hasCompleteStatus()) && this.startTime != null && this.finishTime != null;
    }

    public calculateRegression(thresholdTime: number): number {
        return this.getDuration() - thresholdTime;
    }

    public getType() {
        if (this.type) {
            return this.type.toLowerCase();
        }
        return null;
    }
    
    public getIdentifier() {
        return this.name + " " + this.id;
    }

    private hasSignificantRegression(thresholdTime: number, minimumRegressionMilliseconds: number): boolean {
        return this.calculateRegression(thresholdTime) > minimumRegressionMilliseconds;
    }

    private getTimeFromDate(date: Date) {
        if (date) {
            return date.getTime();
        }
        return null;
    }
}
