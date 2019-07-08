import * as azureReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { Build } from "../Build";
import sinon from "sinon";
import { BuildTask } from "../BuildTask";
import { AbstractPipeline } from "../AbstractPipeline";
import { Release } from "../Release";
import { ReleaseTask } from "../ReleaseTask";
import { AbstractPipelineTask } from "../AbstractPipelineTask";


describe('AbstractPipeline Tests', () => {

    let pipeline: AbstractPipeline;
    const FAILED: azureReleaseInterfaces.TaskStatus = azureReleaseInterfaces.TaskStatus.Failed;
    const SUCCEEDED:azureReleaseInterfaces.TaskStatus = azureReleaseInterfaces.TaskStatus.Succeeded;

    function makeMockReleaseData(deploySteps: azureReleaseInterfaces.DeploymentAttempt[]): azureReleaseInterfaces.Release{
        return {
            environments: [{
                deploySteps: deploySteps
            }]
        }
    }

    
    function makeMockDeployStep(releaseTasks?: azureReleaseInterfaces.ReleaseTask[]): azureReleaseInterfaces.DeploymentAttempt{
        return {
            releaseDeployPhases: [
                {deploymentJobs: 
                    [{tasks: releaseTasks}]
                }
            ]
        }    
    }

    function makeMockReleaseTaskData(name: string, taskStatus: azureReleaseInterfaces.TaskStatus): azureReleaseInterfaces.ReleaseTask{
        return {
            name: name,
            status: taskStatus
        }
    }

    test('Returns all tasks when tasks are set', () => {
        let expectedtasksData: azureReleaseInterfaces.ReleaseTask[] = [makeMockReleaseTaskData("abc", FAILED), makeMockReleaseTaskData("xyz", SUCCEEDED)];
       let expectedTasks: AbstractPipelineTask[] = [new ReleaseTask(makeMockReleaseTaskData("abc", FAILED)), new ReleaseTask(makeMockReleaseTaskData("xyz", SUCCEEDED))];
       pipeline = new Release(makeMockReleaseData([makeMockDeployStep(expectedtasksData), makeMockDeployStep([makeMockReleaseTaskData("kljjl", FAILED)])]));
       expect(pipeline.getTasks()).toEqual(expectedTasks);
    });

    
    test('Returns no tasks when tasks are not set', () => {
        let expectedtasksData: azureReleaseInterfaces.ReleaseTask[] = null;
       pipeline = new Release(makeMockReleaseData([makeMockDeployStep(expectedtasksData), makeMockDeployStep([makeMockReleaseTaskData("kljjl", FAILED)])]));
       expect(pipeline.getTasks()).toEqual([]);
    });

    
    test('', () => {
       
    });


    
    test('', () => {
       
    });

})