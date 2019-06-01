import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../Build";


describe('Build', () => {

    let build: Build;
    const failedTask: azureBuildInterfaces.TimelineRecord = {
        result: azureBuildInterfaces.TaskResult.Failed,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    }
    const succeededTask: azureBuildInterfaces.TimelineRecord = {
        result: azureBuildInterfaces.TaskResult.Succeeded,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    }

    test('Complete failed build is failure', () => {
        const mockBuild: azureBuildInterfaces.Build = {
            result: azureBuildInterfaces.BuildResult.Failed,
            status: azureBuildInterfaces.BuildStatus.Completed,
        }
        const mockTimeLine: azureBuildInterfaces.Timeline = {
            records: [failedTask]
        }
        build = new Build(mockBuild, mockTimeLine);
        expect(build.isFailure()).toBe(true); 
    })

    test('Incomplete failed build is failure', () => {
        const mockBuild: azureBuildInterfaces.Build = {
            status: azureBuildInterfaces.BuildStatus.InProgress,
        }
        const mockTimeLine: azureBuildInterfaces.Timeline = {
            records: [succeededTask, failedTask, succeededTask]
        }
        build = new Build(mockBuild, mockTimeLine);
        expect(build.isFailure()).toBe(true); 
    })

    test('Incomplete build without current failures is not failure', () => {
        const mockBuild: azureBuildInterfaces.Build = {
            status: azureBuildInterfaces.BuildStatus.InProgress,
        }
        const mockTimeLine: azureBuildInterfaces.Timeline = {
            records: [succeededTask, succeededTask]
        }
        build = new Build(mockBuild, mockTimeLine);
        expect(build.isFailure()).toBe(false); 
    })
})