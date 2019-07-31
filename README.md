# Pull Request Insights for Azure Pipelines
Pull Request Insights is an extension for Azure DevOps that provides insights into builds and releases resulting from
pull requests. This extension has two main functions: (1) Investigating pull request validation failures and
(2) Alerting pull request owners to the introduction of long running tasks. All insights are provided in the form of
a comment on the page of the pull request that triggered the validation.
### Validation Failure Feature
When a pull request validation fails, it is often unclear whether the failure is a result of changes introduced by the PR
owner or if it was due to existing problems on the target branch. This extension aims to combat this issue by showing the status of the 
target branch at the time of the PR merge commit. The status of the target branch is represented by Xs and checks 
indicating whether the last 3 target builds or releases at the time of the merge commit failed or succeeded. 
The comment also gives an insight by declaring the target branch as healthy, unhealthy, or flakey and links the PR owner to a configurable link
for more assistance. By default, this link goes to the summary definition of the failed pipeline.
### Long Running Validation Feature
Pull requests may inadvertently introduce regression for tasks within builds and releases without awareness of the PR owner. This
extension sheds light on this problem by calculating the regression and displaying it when it is over a configurable threshold. The threshold time
for how long a task should take is calucated based on a configurable percentile time for recent builds or releases on the target 
branch prior to the merge commit. When regression is found, this extension will post information concerning the regressive 
task on the PR page, allowing them to decide if the regression is reasonable to introduce. Additionally, for multi-agent pipelines, the number of agents regressed
on will be shown along with the range of regression.
# Running Task
To compile and build the task, enter the pullRequestInsightsTask folder and run the commands:
```
tsc
npm install
```
In order to run unit tests, enter the pullRequestInsightsTask folder and run the command:
```
npm test
```

To try the task without installing it on a pipeline, the file .\azure-pipelines-prinsights\pullRequestInsightsTask\tests\_\_e_to_e_tests\_\_\invokeTest.js 
can be run to invoke an end to end test.
Before running the test, all variables should be set within the test in order to simultate the environment configurations the extension
would access when running as a task within a pipeline.
To run the test, enter the pullRequestInsightsTask folder and run the commands:
```
tsc
node C:\azure-pipelines-prinsights\pullRequestInsightsTask\tests\_\_e_to_e_tests\_\_\invokeTest.js
```
# Telemetry
This extension collects telemetry data. We report the following data:
    * User inputs 
    * Pipeline id and host type
    * Task results (regression found, failure found, comment needed)
# Contributing
This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.
When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
####