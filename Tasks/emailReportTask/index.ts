import tl = require("azure-pipelines-task-lib/task");
import { ReportConfiguration } from "./config/ReportConfiguration";
import { ConfigurationProvider } from "./config/ConfigurationProvider";
import { ReportManager } from "./ReportManager";
import { ReportProvider } from "./providers/ReportProvider";
import { DataProviderFactory } from "./providers/DataProviderFactory";
import { HTMLReportCreator } from "./htmlreport/HTMLReportCreator";
import { EmailSender } from "./EmailSender";

async function run(): Promise<void> {
  const configProvider = new ConfigurationProvider();
  const reportConfiguration = new ReportConfiguration(configProvider);
  const reportProvider = new ReportProvider(new DataProviderFactory(configProvider.getPipelineConfiguration()));

  const reportManager = new ReportManager(
    reportProvider,
    new HTMLReportCreator(),
    new EmailSender());

  await reportManager.sendReportAsync(reportConfiguration);
}

run();