import tl = require("azure-pipelines-task-lib/task");
import { IConfigurationProvider } from "../../config/IConfigurationProvider";
import { SendMailCondition } from "../../config/report/SendMailCondition";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
import { MailConfiguration } from "../../config/mail/MailConfiguration";
import { ReportDataConfiguration } from "../../config/report/ReportDataConfiguration";
import { ReportConfiguration } from "../../config/ReportConfiguration";
import { ReportManager } from "../../ReportManager";
import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { TestResultsConfiguration } from "../../config/report/TestResultsConfiguration";
import { RecipientsConfiguration } from "../../config/mail/RecipientsConfiguration";
import { SmtpConfiguration } from "../../config/mail/SmtpConfiguration";
import { PipelineType } from "../../config/pipeline/PipelineType";
import { ReportProvider } from "../../providers/ReportProvider";
import { DataProviderFactory } from "../../providers/DataProviderFactory";
import { HTMLReportCreator } from "../../htmlreport/HTMLReportCreator";
import { IReportSender } from "../../IReportSender";
import { IHTMLReportCreator } from "../../htmlreport/IHTMLReportCreator";
import { Report } from "../../model/Report";
import { EmailReportViewModel } from "../../model/viewmodel/EmailReportViewModel";
import { EmailSender } from "../../EmailSender";

const fs = require("fs");
const js2xmlparser = require("js2xmlparser");

export class FileWriter {

 static writeToFile(content: string, fileName: string): void {
    const currDir = __dirname;
    console.log(`CurrentDir: ${currDir}`);
    var msgPath = `${currDir}\\${fileName}`;
    fs.writeFile(msgPath, content, (err: string) => {
      if(err) {
          return console.log(err);
      }
      console.log("File saved successfully!")}
    );
  }
}

export class FileSender implements IReportSender {
  async sendReportAsync(report: Report, htmlReportMessage: string, mailConfiguration: MailConfiguration): Promise<void> {
    FileWriter.writeToFile(htmlReportMessage, "emailMessage.html");
  }
}

export class ReportCreatorWrapper implements IHTMLReportCreator {
  createHtmlReport(report: Report, reportConfiguration: ReportConfiguration): string {
    // Serialize gathered data into xml 
    const xmlString: string = js2xmlparser.parse("EmailReportViewModel", new EmailReportViewModel(report, reportConfiguration));
    FileWriter.writeToFile(xmlString, "reportViewModel.xml");
    const actualCreator = new HTMLReportCreator();
    return actualCreator.createHtmlReport(report, reportConfiguration);
  }

  
}

export class MockConfigProvider implements IConfigurationProvider {

  getPipelineConfiguration(): PipelineConfiguration {
    const accessKey = process.argv[process.argv.length - 3];
    return new PipelineConfiguration(PipelineType.Release, 11571808, "AzureDevOps", "AzureDevOps", 133233996, 9462, true, "https://dev.azure.com/mseng", accessKey);
  }  
  
  getMailConfiguration(): MailConfiguration {
    const username = process.argv[process.argv.length - 2];
    const password = process.argv[process.argv.length - 1];
    return new MailConfiguration("Test", 
      new RecipientsConfiguration("svajjala@microsoft.com", false, false, false, false),
      new RecipientsConfiguration("svajjala@microsoft.com", false, false, false, false),
      new SmtpConfiguration(username, password, "smtp.live.com", false), 
      "microsoft.com");
  }

  getReportDataConfiguration(): ReportDataConfiguration {
    const testResultsConfig = new TestResultsConfiguration(true, false, false, false, false, GroupTestResultsBy.Run, 10);
    return new ReportDataConfiguration(true, false, true, [ GroupTestResultsBy.Run ], testResultsConfig);
  }

  getSendMailCondition(): SendMailCondition {
    return SendMailCondition.Always;
  }
}

async function run(): Promise<void> {

  const configProvider = new MockConfigProvider();
  const reportConfiguration = new ReportConfiguration(configProvider);
  const reportManager = new ReportManager(
    new ReportProvider(new DataProviderFactory(configProvider.getPipelineConfiguration())), 
    new ReportCreatorWrapper(),
    new EmailSender());

  reportManager.sendReportAsync(reportConfiguration);
}

run();

