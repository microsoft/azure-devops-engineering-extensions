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
import { IHTMLReportCreator } from "../../htmlreport/IHTMLReportCreator";
import { Report } from "../../model/Report";
import { EmailReportViewModel } from "../../model/viewmodel/EmailReportViewModel";
import { isNullOrUndefined } from "util";
import { EmailSender } from "../../EmailSender";

const fs = require("fs");
const js2xmlparser = require("js2xmlparser");

const accessKey = process.env.AccessKey;
const smtpUser = process.env.SMTPUSER;
const smtpPassword = process.env.SMTPPASSWORD;


export class FileWriter {

  static writeToFile(content: string, fileName: string): void {
    const currDir = __dirname;
    console.log(`CurrentDir: ${currDir}`);
    var msgPath = `${currDir}\\${fileName}`;
    fs.writeFile(msgPath, content, (err: string) => {
      if (err) {
        return console.log(err);
      }
      console.log("File saved successfully!")
    }
    );
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
    return new PipelineConfiguration(PipelineType.Release, 13138547, "AzureDevOps", "AzureDevOps", 150011327, 6074, false, "https://dev.azure.com/mseng/", accessKey);
  }

  getMailConfiguration(): MailConfiguration {
    return new MailConfiguration("[{environmentStatus}] {passPercentage} tests passed",
      new RecipientsConfiguration("xyz@test.com", false, false, false, false),
      new RecipientsConfiguration("", false, false, false, false),
      new SmtpConfiguration(smtpUser, smtpPassword, "smtp.live.com", true), "test.com");
  }

  getReportDataConfiguration(): ReportDataConfiguration {
    const testResultsConfig = new TestResultsConfiguration(true, false, false, false, false, GroupTestResultsBy.Run, 10);
    return new ReportDataConfiguration(true, false, true, [GroupTestResultsBy.Priority, GroupTestResultsBy.Run], testResultsConfig);
  }

  getSendMailCondition(): SendMailCondition {
    return SendMailCondition.OnNewFailuresOnly;
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

if (isNullOrUndefined(accessKey)) {
  console.error("Set Environment Vars for AccessKey.");
} else {
  run();
}
