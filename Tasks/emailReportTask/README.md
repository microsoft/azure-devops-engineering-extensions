# Email Report Extension for Azure DevOps Marketplace

Generates a Report with the information from the pipeline and sends it as email. Goal is to provide all the relevant info happened in the pipeline, in a concise and neat manner. 

Report contains:
* Overall Test Summary : This info mirrors the Test Tab in the Pipeline. 
* Test Run Summary: Information about individual test runs happened in the Pipeline if any.
* Test Failures: Shows Test Failures, their stack traces (Configurable in the Task Input) and associated workitems.
* Commits/Changeset Information
* Phases/Environments Information
* Task information: Task(s) that ran in the pipeline - Name, Duration and any error logs if failed. 


## Configuring Email Task

The Email Task can be added to your pipeline, preferably at the end of the pipeline for the task to be able to gather data for the entire run. The email report task is present under 'Utilities' catagory.

### Configure Email Task to always run

**Make sure that the "Always run" flag is set for the task so that you get the email report irrespective of previous tasks' outcome in the pipeline.**

You can configure the email task as below:

### Send Mail Configuration

**Send Mail Condition** - You can configure when you want to receive the email. i.e, on Success, on Failure or Always. When on Failure is selected, we send the email only if there is a test failure or there are previous task failures.

**Email Subjec**t - User can configure the email subject he wants to get. You can add any environment variables here which will be expanded. To add test pass percentage in the email subject, we have exposed a place holder **{passPercentage}**, which you can use in the email subject, as shown below.

**Include in To/Cc Section** - You can dynamically add who wants to receive the email when the send mail condition is satisfied. For eg, you can configure to send email to the people who authored the commits that were tested in the current release. Or, if there are test failures, u can configure to send email to the failed test owners & active bug owners that are associated to the failing tests.

**To/Cc** - You can add a fixed list of people who wants to recieve the email when the send mail condition is satisfied.

![TaskConfig.png](images/TaskConfig.png)

### Configuring Email content

**Group Test Summary** - You can add test summary sections by Test run or Test priority.

**Include Test Results** - If there are test failures, you can configure if you want to see the test result details. You can configure to receive failed tests & Other tests.

**Group Test Results** - You can group the tests results shown by priority or Test run.

**Include Commits** - Check this field to receive the commits that are tested in the current release environment.

![TaskConfig2.png](images/TaskConfig2.png)

### Advanced Section

**Maximum Test results to show** - User can set the maximum test results that they want to receive in the email report. If there are test failures more than this, it will be truncated & will be notified that the test results are truncated.

**Include Others in Total count** - Used to configure if the others tests (NotExecuted, inconclusive etc), has to be considered as failure for calculating Pass percentage

### SMTP Connection 

Create a "Generic" Service Connection in 'AzureDevOps' Service Connections with a Username, password and SMTP Server. Select the created endpoint from the dropdown menu in the task. 
Try to use public SMTP servers - for example - “smtp.live.com” (Hotmail/Outlook.com).
SMTP credentials generic endpoint can be configured as below for example:
![GenericEndPoint.JPG](images/GenericEndPoint.png)