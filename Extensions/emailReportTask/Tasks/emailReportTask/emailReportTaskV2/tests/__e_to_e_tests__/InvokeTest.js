"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockConfigProvider = exports.FileWriter = void 0;
const SendMailCondition_1 = require("../../config/report/SendMailCondition");
const PipelineConfiguration_1 = require("../../config/pipeline/PipelineConfiguration");
const MailConfiguration_1 = require("../../config/mail/MailConfiguration");
const ReportDataConfiguration_1 = require("../../config/report/ReportDataConfiguration");
const ReportConfiguration_1 = require("../../config/ReportConfiguration");
const ReportManager_1 = require("../../ReportManager");
const GroupTestResultsBy_1 = require("../../config/report/GroupTestResultsBy");
const TestResultsConfiguration_1 = require("../../config/report/TestResultsConfiguration");
const RecipientsConfiguration_1 = require("../../config/mail/RecipientsConfiguration");
const SmtpConfiguration_1 = require("../../config/mail/SmtpConfiguration");
const PipelineType_1 = require("../../config/pipeline/PipelineType");
const ReportProvider_1 = require("../../providers/ReportProvider");
const DataProviderFactory_1 = require("../../providers/DataProviderFactory");
const HTMLReportCreator_1 = require("../../htmlreport/HTMLReportCreator");
const util_1 = require("util");
const EmailSender_1 = require("../../EmailSender");
const TelemetryLogger_1 = require("../../telemetry/TelemetryLogger");
const fs = require("fs");
const accessKey = process.env.AccessKey;
const smtpUser = process.env.SMTPUSER;
const smtpPassword = process.env.SMTPPASSWORD;
class FileWriter {
    static writeToFile(content, fileName) {
        const currDir = __dirname;
        console.log(`CurrentDir: ${currDir}`);
        var msgPath = `${currDir}\\${fileName}`;
        fs.writeFile(msgPath, content, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("File saved successfully!");
        });
    }
}
exports.FileWriter = FileWriter;
class MockConfigProvider {
    getPipelineConfiguration() {
        return new PipelineConfiguration_1.PipelineConfiguration(PipelineType_1.PipelineType.Release, 13942411, "ProjectId", "ProjectName", 160977787, 9462, false, "https://dev.azure.com/{account}/", accessKey);
    }
    getMailConfiguration() {
        return new MailConfiguration_1.MailConfiguration("[{environmentStatus}] {passPercentage} tests passed", new RecipientsConfiguration_1.RecipientsConfiguration("xyz@email.com", false, false, false, false), new RecipientsConfiguration_1.RecipientsConfiguration("", false, false, false, false), new SmtpConfiguration_1.SmtpConfiguration(smtpUser, smtpPassword, "smtp.live.com", true), "test.com");
    }
    getReportDataConfiguration() {
        const testResultsConfig = new TestResultsConfiguration_1.TestResultsConfiguration(true, false, false, false, false, GroupTestResultsBy_1.GroupTestResultsBy.Run, 10);
        return new ReportDataConfiguration_1.ReportDataConfiguration(true, false, true, [GroupTestResultsBy_1.GroupTestResultsBy.Priority, GroupTestResultsBy_1.GroupTestResultsBy.Run], testResultsConfig);
    }
    getSendMailCondition() {
        return SendMailCondition_1.SendMailCondition.Always;
    }
}
exports.MockConfigProvider = MockConfigProvider;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Node Version: ' + process.version);
        const configProvider = new MockConfigProvider();
        const reportConfiguration = new ReportConfiguration_1.ReportConfiguration(configProvider);
        TelemetryLogger_1.TelemetryLogger.LogTaskConfig(reportConfiguration);
        const reportManager = new ReportManager_1.ReportManager(new ReportProvider_1.ReportProvider(new DataProviderFactory_1.DataProviderFactory(configProvider.getPipelineConfiguration())), new HTMLReportCreator_1.HTMLReportCreator(), new EmailSender_1.EmailSender());
        reportManager.sendReportAsync(reportConfiguration);
    });
}
if (util_1.isNullOrUndefined(accessKey)) {
    console.error("Set Environment Vars for AccessKey.");
}
else {
    run();
}
//# sourceMappingURL=InvokeTest.js.map