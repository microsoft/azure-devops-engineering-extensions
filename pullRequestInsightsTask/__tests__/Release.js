"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Release_1 = require("../Release");
var azureReleaseInterfaces = __importStar(require("azure-devops-node-api/interfaces/ReleaseInterfaces"));
describe('Release Tests', function () {
    var release;
    var mockReleaseData;
    function fillMockReleaseData(deploySteps) {
        mockReleaseData = {
            environments: [{
                    deploySteps: deploySteps
                }]
        };
    }
    function getMockDeployStep(deployStatus, deployReason, deployPhases) {
        return {
            status: deployStatus,
            releaseDeployPhases: deployPhases,
            reason: deployReason
        };
    }
    function getMockDeployPhase(releaseTasks) {
        return {
            deploymentJobs: [{
                    tasks: releaseTasks
                }]
        };
    }
    function getMockReleaseTask(taskStatus) {
        return {
            status: taskStatus
        };
    }
    test('Complete failed release is failure', function () {
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.Failed, azureReleaseInterfaces.DeploymentReason.Automated)]);
        release = new Release_1.Release(mockReleaseData);
        expect(release.isFailure()).toBe(true);
    });
    test('Incomplete failed release is failure', function () {
        var deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Skipped), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Failed)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release_1.Release(mockReleaseData);
        expect(release.isFailure()).toBe(true);
    });
    test('Incomplete failed release with multiple deployment phases is failure', function () {
        var deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)]), getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Failed)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release_1.Release(mockReleaseData);
        expect(release.isFailure()).toBe(true);
    });
    test('Correct deployment attempt is selected for failure assessment', function () {
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.Failed, azureReleaseInterfaces.DeploymentReason.Manual), getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.Succeeded, azureReleaseInterfaces.DeploymentReason.Automated)]);
        release = new Release_1.Release(mockReleaseData);
        expect(release.isFailure()).toBe(true);
    });
    test('Incomplete release without current failures is not failure', function () {
        var deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)]), getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release_1.Release(mockReleaseData);
        expect(release.isFailure()).toBe(false);
    });
    test('Release with incomplete failed task is not a failure', function () {
        var deployPhases = [getMockDeployPhase([getMockReleaseTask(azureReleaseInterfaces.TaskStatus.InProgress), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Succeeded), getMockReleaseTask(azureReleaseInterfaces.TaskStatus.Pending)])];
        fillMockReleaseData([getMockDeployStep(azureReleaseInterfaces.DeploymentStatus.InProgress, azureReleaseInterfaces.DeploymentReason.Automated, deployPhases)]);
        release = new Release_1.Release(mockReleaseData);
        expect(release.isFailure()).toBe(false);
    });
});
