import { AbstractPipelineTaskRun } from "./AbstractPipelineTaskRun";
import tl = require('azure-pipelines-task-lib/task');

export class PipelineTask {

    private name: string;
    private id: string;
    private type: string;
    private taskRuns: AbstractPipelineTaskRun[];
    private thresholdTime: number;
    private minimumDurationMiliseconds: number;
    private minimumRegressionMilliseconds: number;

    constructor(name: string, id: string, type: string) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.taskRuns = [];
        this.thresholdTime = 0;
        this.minimumDurationMiliseconds = 0;
        this.minimumRegressionMilliseconds = 0;
    }

    public getName(): string {
        return this.name;
    }

    public getId(): string {
        return this.id;
    }

    public getType(): string {
        return this.type;
    }

    public addTaskInstance(taskInstanceToAdd: AbstractPipelineTaskRun) {
        if (this.isMatchingTask(taskInstanceToAdd.getName(), taskInstanceToAdd.getId(), taskInstanceToAdd.getType())) {
            tl.debug("added task instance from agent " + taskInstanceToAdd.getAgentName() + " to long running validation " + this.name);
            this.taskRuns.push(taskInstanceToAdd);
        }
    }
    
    public setRegressionStandards(thresholdTime: number, minimumDurationMiliseconds: number, minimumRegressionMilliseconds: number) {
        this.thresholdTime = thresholdTime;
        this.minimumDurationMiliseconds = minimumDurationMiliseconds;
        this.minimumRegressionMilliseconds = minimumRegressionMilliseconds;
    }

    public getAllDurations(): number[] {
        let durations: number[] = [];
        for (let run of this.taskRuns) {
            if (run.getDuration()) {
                durations.push(run.getDuration())
            }
        }
        return durations;
    }

    public getLongestRegressiveDuration(): number {
        return Math.max(...this.getAllRegressiveDurations());
    }

    public getShortestRegressiveDuration(): number {
        return Math.min(...this.getAllRegressiveDurations());
    }

    public getLongestRegression(): number {
        return this.getDurationsToRegression().get(this.getLongestRegressiveDuration());
    }

    public getShortestRegression(): number {
        return this.getDurationsToRegression().get(this.getShortestRegressiveDuration());
    }

    public getNumberOfAgentsRunOn(): number {
        return this.calculateNumberOfAgentsForGivenRuns(this.taskRuns);
    }

    public getNumberOfAgentsRegressedOn(): number {
        return this.calculateNumberOfAgentsForGivenRuns(this.getRegressiveInstances());
    }

    public hasFailedInstance(): boolean {
        for (let run of this.taskRuns) {
            if (run.ran() && run.wasFailure()) {
                return true;
            }
        }
        return false;
    }

    public hasRegressiveInstances(): boolean {
        return this.getRegressiveInstances().length > 0;
    }

    public isMatchingTask(nameToCompare: string, idToCompare: string, typeToCompare: string): boolean {
        return this.getName() === nameToCompare && this.getId() === idToCompare && this.getType() === typeToCompare;
    }

    private calculateNumberOfAgentsForGivenRuns(runs: AbstractPipelineTaskRun[]) {
        let agents: Set<string> = new Set();
        for (let run of runs) {
            agents.add(run.getAgentName());
        }
        return agents.size;
    }

    private getAllRegressiveDurations(): number[] {
        return Array.from(this.getDurationsToRegression().keys());
    }

    private getDurationsToRegression(): Map<number, number> {
        let durationsToRegressions = new Map<number, number>();
        for (let run of this.getRegressiveInstances()) {
            durationsToRegressions.set(run.getDuration(), run.calculateRegression(this.thresholdTime));
        }
        return durationsToRegressions;
    }

    private getRegressiveInstances(): AbstractPipelineTaskRun[] {
        let regressiveRuns = [];
        for (let run of this.taskRuns) {
            if (run.isLongRunning(this.thresholdTime, this.minimumDurationMiliseconds, this.minimumRegressionMilliseconds)) {
                regressiveRuns.push(run);
            }
        }
        return regressiveRuns;
    }

}