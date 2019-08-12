# Email Report Extension for Azure DevOps Marketplace

Generates a Report with the information from the pipeline and sends it as email. Goal is to provide all the relevant info happened in the pipeline, in a concise and neat manner. 

Report contains:
* Overall Test Summary : This info mirrors the Test Tab in the Pipeline. 
* Test Run Summary: Information about individual test runs happened in the Pipeline if any.
* Test Failures: Shows Test Failures and their stack traces (Configurable in the Task Input).
* Commits/Changeset Information
* Phases/Environments Information
* Task information: Task(s) that ran in the pipeline - Name, Duration and any error logs if failed. 