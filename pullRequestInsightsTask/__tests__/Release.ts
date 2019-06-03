import { Release } from "../Release";
import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";

describe('Release Tests', () => {

    let release: Release;
    let mockReleaseData: azureReleaseInterfaces.Release;

    function fillMockReleaseData(deploySteps: azureReleaseInterfaces.DeploymentAttempt[]): void{
        mockReleaseData = {
            environments: [{
                deploySteps: deploySteps
            }]
        }
    }

    function getMockDeployStep(deployStatus: azureReleaseInterfaces.DeploymentStatus, deployReason: azureReleaseInterfaces.DeploymentReason, deployPhases?: azureReleaseInterfaces.ReleaseDeployPhase[]): azureReleaseInterfaces.DeploymentAttempt{
        return {
            status: deployStatus,
            releaseDeployPhases: deployPhases,
            reason: deployReason
        }
    }

    function getMockDeployPhase(releaseTasks: azureReleaseInterfaces.ReleaseTask[]): azureReleaseInterfaces.ReleaseDeployPhase{
        return {
            deploymentJobs: [{
                tasks: releaseTasks
            }]
        } 
    }

    function getMockReleaseTask(taskStatus: azureReleaseInterfaces.TaskStatus): azureReleaseInterfaces.ReleaseTask{
        return {
            status: taskStatus
        }
    }

    test('Complete failed release is failure', () => {
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.Failed, azureReleaseInterfaces.DeploymentReason.Automated)]);
        release = new Release(mockReleaseData);
        expect(release.isFailure()).toBe(true); 
    });

    test('Incomplete failed release is failure', () => {
        let deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Skipped), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Failed)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release(mockReleaseData);
        expect(release.isFailure()).toBe(true); 
    });

    test('Incomplete failed release with multiple deployment phases is failure', () => {
        let deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)]), getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Failed)])]
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release(mockReleaseData);
        expect(release.isFailure()).toBe(true); 
   });

   test('Correct deployment attempt is selected for failure assessment', () => {
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.Failed, azureReleaseInterfaces.DeploymentReason.Manual), getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.Succeeded, azureReleaseInterfaces.DeploymentReason.Automated)]);
        release = new Release(mockReleaseData);
        expect(release.isFailure()).toBe(false); 
    });

    test('Incomplete release without current failures is not failure', () => {
        let deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)]), getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release(mockReleaseData);
        expect(release.isFailure()).toBe(false); 
    });

    test('Release with incomplete failed task is not a failure', () => {
        let deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.InProgress), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Pending)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release(mockReleaseData);
        expect(release.isFailure()).toBe(false); 
    });
})