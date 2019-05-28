import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import tl = require('azure-pipelines-task-lib/task');

export class Build{

    private buildData: azureBuildInterfaces.Build; 

    constructor(buildData: azureBuildInterfaces.Build){
        this.buildData = buildData;
    }

    public failed() : boolean{
        return this.buildData.result === azureBuildInterfaces.BuildResult.Failed;
    }

    public willFail(timelineData: azureBuildInterfaces.Timeline) : boolean {
        let failed = false;
        if (timelineData.records !== undefined){
            timelineData.records.forEach(taskRecord => {
                if (this.taskFailed(taskRecord)){
                    failed = true;
                }
            }); 
        }
        return failed;
    }

    public completed(): boolean {
        return this.buildData.status === azureBuildInterfaces.BuildStatus.Completed;
    }

    public getDefinitionId(): number{
        if (this.buildData.definition !== undefined && this.buildData.definition.id !== undefined){
            return this.buildData.definition.id;
        }
        throw(new Error("no definition available"));            
    }

    public getLink(): string{
        return String(this.buildData._links.web.href);
    }

    public getId(): number{
        return Number(this.buildData.id); 
    }

    private taskFailed(task: azureBuildInterfaces.TimelineRecord): boolean{
        return task.state === azureBuildInterfaces.TimelineRecordState.Completed && task.result === azureBuildInterfaces.TaskResult.Failed; 
    }
} 