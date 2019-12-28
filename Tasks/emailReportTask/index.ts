import tl = require("azure-pipelines-task-lib/task");
import { ReportConfiguration } from "./config/ReportConfiguration";
import { ConfigurationProvider } from "./config/ConfigurationProvider";
import { ReportManager } from "./ReportManager";
import { ReportProvider } from "./providers/ReportProvider";
import { DataProviderFactory } from "./providers/DataProviderFactory";
import { HTMLReportCreator } from "./htmlreport/HTMLReportCreator";
import { EmailSender } from "./EmailSender";
import { ReportError } from "./exceptions/ReportError";
import { TelemetryLogger } from "./telemetry/TelemetryLogger";

async function run(): Promise<void> {
  try {
    const configProvider = new ConfigurationProvider();
    const reportConfiguration = new ReportConfiguration(configProvider);
    const reportProvider = new ReportProvider(new DataProviderFactory(configProvider.getPipelineConfiguration()));

    // Log telemetry: Task Inputs and Configuration
    TelemetryLogger.LogTaskConfig(reportConfiguration);

    const reportManager = new ReportManager(
      reportProvider,
      new HTMLReportCreator(),
      new EmailSender());

    const mailSent = await reportManager.sendReportAsync(reportConfiguration);
    if(mailSent) {
      // Wait for 10 sec and timeout
      let val = await Promise.race([sleep(10000), setEmailSentVariable(mailSent)]);
      if(!val) {
        console.log("Unable to set variable value in 10 sec. Exiting task.");
      }
    }
  }
  catch (err) {
    if (err instanceof ReportError) {
      console.log(err.getMessage());
    } else {
      console.log(err);
    }
    // Fail task
    throw err;
  }
  finally {
    console.log("Task Processing Complete.");
  }
}

function sleep(ms: number): Promise<boolean> {
  return new Promise(resolve => setTimeout(resolve, ms, false));
}

async function setEmailSentVariable(mailSent: boolean) : Promise<boolean> {
  console.log("Setting EmailReportTask.EmailSent Variable value.");
  console.log(`##vso[task.setvariable variable=EmailReportTask.EmailSent;]${mailSent}`);
  console.log(`EmailReportTask.EmailSent Variable value set as ${mailSent}`);
  return true;
}

run();