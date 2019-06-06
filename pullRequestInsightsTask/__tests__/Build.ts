import * as azureBuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Build } from "../Build";


describe('Build Tests', () => {

    let build: Build;
    let mockBuildData: azureBuildInterfaces.Build;
    let mockBuildTimeline: azureBuildInterfaces.Timeline;
    const failedTask: azureBuildInterfaces.TimelineRecord = {
        result: azureBuildInterfaces.TaskResult.Failed,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    }
    const succeededTask: azureBuildInterfaces.TimelineRecord = {
        result: azureBuildInterfaces.TaskResult.Succeeded,
        state: azureBuildInterfaces.TimelineRecordState.Completed
    }

    function fillMockBuildData(buildStatus: azureBuildInterfaces.BuildStatus, buildResult?: azureBuildInterfaces.BuildResult){
        mockBuildData = {
            status: buildStatus,
            result: buildResult
        }
    }

    function fillMockBuildTimeline(buildRecords: azureBuildInterfaces.TimelineRecord[]){
        mockBuildTimeline = {
            records: buildRecords
        }
    }

    test('Complete failed build is failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.Completed, azureBuildInterfaces.BuildResult.Failed);
        fillMockBuildTimeline([failedTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(true); 
    });

    test('Incomplete failed build is failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, failedTask, succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(true); 
    });

    test('Incomplete build without current failures is not failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        fillMockBuildTimeline([succeededTask, succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false); 
    });

    test('Build with incomplete failed task is not a failure', () => {
        fillMockBuildData(azureBuildInterfaces.BuildStatus.InProgress);
        const inProgressTask: azureBuildInterfaces.TimelineRecord = {
            result: azureBuildInterfaces.TaskResult.Failed,
            state: azureBuildInterfaces.TimelineRecordState.InProgress
        }
        fillMockBuildTimeline([succeededTask, inProgressTask, succeededTask]);
        build = new Build(mockBuildData, mockBuildTimeline);
        expect(build.isFailure()).toBe(false); 
    });
})