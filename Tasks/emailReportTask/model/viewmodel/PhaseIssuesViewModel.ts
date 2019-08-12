import { TaskStatus } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { TaskResultViewModel, TaskResultViewModelWrapper } from "./TaskResultViewModel";
import { PhaseModel } from "../PhaseModel";
import { TaskModel } from "../TaskModel";

export class PhaseIssuesViewModel
{
    /// <summary>
    /// Use TaskResultViewModel as Phase level issue as the viewmodel is same
    /// </summary>
    public Tasks: TaskResultViewModelWrapper = new TaskResultViewModelWrapper();
    public Name: string;

    constructor(phases: PhaseModel[]) {
        this.Name = "Phase Issues";
        this.Tasks.TaskResultViewModel = [];
        phases.forEach(phase => {
            if (phase != null && phase.$jobs != null)
            {
                const canceledJobs = phase.$jobs.filter(job => job.$jobStatus == TaskStatus.Canceled);
                if (canceledJobs.length > 0)
                {
                    var failedJobsAsTasks = canceledJobs.map(job => {
                      return new TaskModel(job.$jobName, job.$jobStatus, job.$issues, null, null, null);
                    }); 
                    var taskResViewModel = new TaskResultViewModel(failedJobsAsTasks);
                    taskResViewModel.IssuesSummary.ErrorMessage = `Failed on ${canceledJobs.length}/${phase.$jobs.length} Agents`;
                    this.Tasks.TaskResultViewModel.push(taskResViewModel);
                }
            }
        });
    }
}