export class TaskIssueViewModelWrapper {
  public TaskIssueViewModel: TaskIssueViewModel[];
}

export class TaskIssueViewModel {

  public Message: string;
  public IssueType: string;
  public AgentName: string;

  constructor(issueMessage: string, issueType: string, agentName: string)
  {
    this.Message = `(${agentName}) ${issueMessage.trim()}`;
    this.IssueType = issueType;
    this.AgentName = agentName;
  }
}