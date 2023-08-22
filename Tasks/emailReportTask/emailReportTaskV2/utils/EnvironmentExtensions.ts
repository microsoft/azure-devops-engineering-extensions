import { ReleaseDeployPhase, ReleaseEnvironment, DeploymentAttempt } from "azure-devops-node-api/interfaces/ReleaseInterfaces";

export class EnvironmentExtensions {
  static getPhases(environment: ReleaseEnvironment): Array<ReleaseDeployPhase> {
    const phases = new Array<ReleaseDeployPhase>();
    if (environment.deploySteps != null && environment.deploySteps.length > 0) {
      let attempt = 0;
      let latestDeploySteps: DeploymentAttempt = environment.deploySteps[0];
      for (var i: number = 0; i < environment.deploySteps.length; i++) {
        if (environment.deploySteps[i].attempt > attempt) {
          latestDeploySteps = environment.deploySteps[i];
        }
      }

      phases.push(...latestDeploySteps.releaseDeployPhases);
    }
    return phases;
  }
}
