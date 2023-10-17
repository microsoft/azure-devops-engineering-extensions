import { TestCaseResult, WorkItemReference } from "azure-devops-node-api/interfaces/TestInterfaces";

import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";

export class TestResultModel {
  public testResult: TestCaseResult;
  public associatedBugRefs: WorkItemReference[] = [];
  public associatedBugs: WorkItem[] = [];
}