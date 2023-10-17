import { JobModel } from "../JobModel";
import { TaskModel } from "../TaskModel";
import { TaskResultViewModel, TaskResultViewModelWrapper } from "./TaskResultViewModel";

export class DeploymentJobViewModel {
  public Tasks: TaskResultViewModelWrapper;
  public MinTaskStartTime: Date;
  public MaxTaskFinishTime: Date;

  constructor(jobs: JobModel[]) {
    this.Tasks = new TaskResultViewModelWrapper();
    this.Tasks.TaskResultViewModel = [];

    if (jobs.length > 0) {
      let taskIndex = 0;
      let releaseTasks: TaskModel[] = [];
      do {
        releaseTasks = [];
        jobs.forEach(job => {
          // Not all jobs have same set of tasks
          if (taskIndex < job.$tasks.length) {
            releaseTasks.push(job.$tasks[taskIndex]);
            this.MinTaskStartTime = this.getMinTime(this.MinTaskStartTime, job.$tasks[taskIndex].$startTime);
            this.MaxTaskFinishTime = this.getMaxTime(this.MaxTaskFinishTime, job.$tasks[taskIndex].$finishTime);
          }
        });

        if (releaseTasks != null && releaseTasks.length > 0) {
          this.Tasks.TaskResultViewModel.push(new TaskResultViewModel(releaseTasks));
        }

        taskIndex++;

      } while (releaseTasks.length > 0);
    }
  }

  private getMinTime(time1: Date, time2: Date): Date {
    if (time1 == null) {
      return time2;
    }
    else if (time2 != null && time2 < time1) {
      return time2;
    }

    return time1;
  }

  private getMaxTime(time1: Date, time2: Date): Date {
    if (time1 == null) {
      return time2;
    }
    else if (time2 != null && time2 > time1) {
      return time2;
    }

    return time1;
  }
}