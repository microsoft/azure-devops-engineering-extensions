

export abstract class AbstractPipelineTask {

    private name: string
    private id: string
    private startTime: number
    private finishTime: number

    constructor(name: string, id: string, startTime: Date, finishTime: Date) {
        this.name = name
        this.id = id;
        this.startTime = this.getTimeFromDate(startTime);
        this.finishTime = this.getTimeFromDate(finishTime);
    }

    
    protected abstract hasCompleteStatus(): boolean;

    public abstract wasFailure(): boolean;

    public getName(): string {
        return this.name;
    } 

    public getId(): string {
        return this.id;
    } 

    public equals(other: AbstractPipelineTask): boolean {
        return this.getName() === other.getName() && this.getId() === other.getId();
    }

    public isLongRunning(thresholdTime: number): boolean {
        let taskLength = this.getDuration();
        if (thresholdTime && taskLength && taskLength > thresholdTime) {
            return true;
        }
        return false;
    }

    public getDuration(): number {
        if (this.ran()) {
            return this.finishTime - this.startTime;
        }
        return null;
    }

    public ran(): boolean {
        return (this.hasCompleteStatus()) && this.startTime != null && this.finishTime != null;
    }

    private getTimeFromDate(date: Date) {
        if (date) {
            return date.getTime();
        }
        return null;
    }

}
