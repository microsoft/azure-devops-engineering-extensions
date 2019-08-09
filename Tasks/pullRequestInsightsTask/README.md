# Pull Request Insights for Azure DevOps Marketplace

Pull Request Insights is an extension for Azure DevOps that provides insights into pipelines.
This extension has two main functions:

1. Investigating pull request validation failures
2. Alerting pull request owners to the introduction of long running tasks.

All insights are provided in the form of a comment on the page of the pull request that triggered the validation.

### Validation Failure Insights

When a pull request validation fails, it is often unclear whether the failure is a result of changes introduced by the pull request
owner or if the failure was due to existing problems on the target branch. This extension aims to combat this issue by giving insight
into possible causes of the failure and suggested actions for the PR owner to take.

![Image of failure insights](images\\failure_comment_example.PNG)

### Long Running Validation Insights

Pull requests may inadvertently introduce regression for tasks within pipelines without awareness of the PR owner. This
extension gives insights into this problem by calculating and displaying regression, allowing the PR owner to decide
if their changes are reasonable to introduce.

![Image of regression insights](images\\regression_comment_example.PNG)

# Telemetry

This extension collects telemetry data. We report the following data:

- User inputs
- Pipeline id and host type
- Task results (regression found, failure found, comment needed)
