import tl = require("azure-pipelines-task-lib/task");
import { ReportConfiguration } from "./config/ReportConfiguration";
import { ConfigurationProvider } from "./config/ConfigurationProvider";
import { ReportManager } from "./ReportManager";
import { ReportProvider } from "./providers/ReportProvider";
import { DataProviderFactory } from "./providers/DataProviderFactory";
import { HTMLReportCreator } from "./htmlreport/HTMLReportCreator";
import { EmailSender } from "./EmailSender";
import { ReportError } from "./exceptions/ReportError";

async function run(): Promise<void> {
  try {
    const configProvider = new ConfigurationProvider();
    const reportConfiguration = new ReportConfiguration(configProvider);
    const reportProvider = new ReportProvider(new DataProviderFactory(configProvider.getPipelineConfiguration()));

    const reportManager = new ReportManager(
      reportProvider,
      new HTMLReportCreator(),
      new EmailSender());

    const mailSent = await reportManager.sendReportAsync(reportConfiguration);
    console.log(`##vso[task.setvariable variable=EmailReportTask.EmailSent;]${mailSent}`);
  }
  catch (err) {
    if (err instanceof ReportError) {
      console.log(err.getMessage());
    }
    // Fail task
    throw err;
  }
}

run();