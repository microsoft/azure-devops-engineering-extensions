# Azure DevOps Engineering Marketplace Extensions

AzureDevOps Marketplace Extensions to do various engineering tasks.

## Pull Request Insights Task
PullRequestInsightsTask provides insights into pipelines. This extension has two main functions:

1. Investigating pull request validation failures
2. Alerting pull request owners to the introduction of long running tasks.

Read more [here](Tasks/pullRequestInsightsTask/README.md).

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

To build:

```
npm install
npm run build
```

To run unit tests (at root): 

```
npm test
```

To try the task without installing it on a pipeline, the file .\js\pullRequestInsightsExtension\pullRequestInsightsTask\tests\_\_e_to_e_tests\_\_\invokeTest.js
can be run to invoke an end to end test.
Before running the test, all variables should be set within the test in order to simultate the environment configurations the extension
would access when running as a task within a pipeline.
To run the test, enter the pullRequestInsightsTask folder and run

```
node C:\azure-pipelines-prinsights\pullRequestInsightsTask\tests\_\_e_to_e_tests\_\_\invokeTest.js
```

Packaging:

```
npm run pack:dev 
npm run pack:prod
```
Note: pack:dev doesn't create a VSIX file. Instead, it prepares the output task folder ready for upload to specific AzureDevOps account.
For More information on packaging the extension code into a vsix file, see [this page](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#packageext).

####
