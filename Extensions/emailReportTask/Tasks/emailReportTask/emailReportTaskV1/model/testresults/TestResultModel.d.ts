import { TestCaseResult, WorkItemReference } from "azure-devops-node-api/interfaces/TestInterfaces";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
export declare class TestResultModel {
    testResult: TestCaseResult;
    associatedBugRefs: WorkItemReference[];
    associatedBugs: WorkItem[];
}
