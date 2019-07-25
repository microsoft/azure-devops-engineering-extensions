import { Release } from "../../dataModels/Release";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";

describe("Release Tests", () => {
  let release: Release;
  let mockReleaseData: azureReleaseInterfaces.Release;

  function fillMockReleaseData(
    deploySteps: azureReleaseInterfaces.DeploymentAttempt[]
  ): void {
    mockReleaseData = {
      environments: [
        {
          deploySteps: deploySteps
        }
      ]
    };
  }

  function makeMockDeployStep(
    deployStatus: azureReleaseInterfaces.DeploymentStatus,
    deployReason: azureReleaseInterfaces.DeploymentReason,
    deployPhases?: azureReleaseInterfaces.ReleaseDeployPhase[]
  ): azureReleaseInterfaces.DeploymentAttempt {
    return {
      status: deployStatus,
      releaseDeployPhases: deployPhases,
      reason: deployReason
    };
  }

  function makeMockDeployPhase(
    releaseTasks: azureReleaseInterfaces.ReleaseTask[]
  ): azureReleaseInterfaces.ReleaseDeployPhase {
    return {
      deploymentJobs: [
        {
          tasks: releaseTasks
        }
      ]
    };
  }

  function makeMockReleaseTask(
    taskStatus: azureReleaseInterfaces.TaskStatus
  ): azureReleaseInterfaces.ReleaseTask {
    return {
      status: taskStatus,
      startTime: new Date(),
      finishTime: new Date()
    };
  }

  test("Complete failed release is failure", () => {
    fillMockReleaseData([
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.Failed,
        azureReleaseInterfaces.DeploymentReason.Automated
      )
    ]);
    release = new Release(mockReleaseData);
    expect(release.isFailure()).toBe(true);
  });

  test("Incomplete failed release is failure", () => {
    const deployPhases = [
      makeMockDeployPhase([
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded),
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Skipped),
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Failed)
      ])
    ];
    fillMockReleaseData([
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.InProgress,
        azureReleaseInterfaces.DeploymentReason.Automated,
        deployPhases
      )
    ]);
    release = new Release(mockReleaseData);
    expect(release.isFailure()).toBe(true);
  });

  test("Incomplete failed release with multiple deployment phases is failure", () => {
    const deployPhases = [
      makeMockDeployPhase([
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)
      ]),
      makeMockDeployPhase([
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded),
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Failed)
      ])
    ];
    fillMockReleaseData([
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.InProgress,
        azureReleaseInterfaces.DeploymentReason.Automated,
        deployPhases
      )
    ]);
    release = new Release(mockReleaseData);
    expect(release.isFailure()).toBe(true);
  });

  test("Correct deployment attempt is selected for failure assessment", () => {
    fillMockReleaseData([
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.Failed,
        azureReleaseInterfaces.DeploymentReason.Manual
      ),
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.Succeeded,
        azureReleaseInterfaces.DeploymentReason.Automated
      )
    ]);
    release = new Release(mockReleaseData);
    expect(release.isFailure()).toBe(true);
  });

  test("Incomplete release without current failures is not failure", () => {
    const deployPhases = [
      makeMockDeployPhase([
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)
      ]),
      makeMockDeployPhase([
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)
      ])
    ];
    fillMockReleaseData([
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.InProgress,
        azureReleaseInterfaces.DeploymentReason.Automated,
        deployPhases
      )
    ]);
    release = new Release(mockReleaseData);
    expect(release.isFailure()).toBe(false);
  });

  test("Release with incomplete failed task is not a failure", () => {
    const deployPhases = [
      makeMockDeployPhase([
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.InProgress),
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded),
        makeMockReleaseTask(azureReleaseInterfaces.TaskStatus.Pending)
      ])
    ];
    fillMockReleaseData([
      makeMockDeployStep(
        azureReleaseInterfaces.DeploymentStatus.InProgress,
        azureReleaseInterfaces.DeploymentReason.Automated,
        deployPhases
      )
    ]);
    release = new Release(mockReleaseData);
    expect(release.isFailure()).toBe(false);
  });
});
