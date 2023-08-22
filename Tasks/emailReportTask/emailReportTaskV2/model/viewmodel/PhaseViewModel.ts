import { DeploymentJobViewModel } from "./DeploymentJobViewModel";
import { PhaseModel } from "../PhaseModel";
import { TimeFormatter } from "../helpers/TimeFormatter";

export class PhaseViewModelWrapper {
  public PhaseViewModel: PhaseViewModel[];
}

export class PhaseViewModel {
  public DeploymentJob: DeploymentJobViewModel;
  public TasksDuration: string;
  public Status: string;
  public Rank: number;
  public Name: string;

  constructor(phase: PhaseModel) {
    this.Status = phase.$status;
    this.Rank = phase.$rank;
    this.Name = phase.$name;
    this.InitializeDeploymentJobs(phase);
  }

  private InitializeDeploymentJobs(phase: PhaseModel) {
    const deploymentJobs = phase.$jobs;

    if (deploymentJobs.length > 0) {
      this.DeploymentJob = new DeploymentJobViewModel(deploymentJobs);
      this.InitializeTasksDuration();
    }
    else {
      // This can happen if we have an empty phase or a phase with only disabled steps
      console.warn(`No deployment jobs found in phase ${this.Name}`);
    }
  }

  private InitializeTasksDuration(): void {
    // Evaluate job duration and format it
    if (this.DeploymentJob.MaxTaskFinishTime != null && this.DeploymentJob.MinTaskStartTime != null) {
      this.TasksDuration = `${TimeFormatter.FormatDuration(
        this.DeploymentJob.MaxTaskFinishTime.getTime() - this.DeploymentJob.MinTaskStartTime.getTime())}`;
    }
  }
}