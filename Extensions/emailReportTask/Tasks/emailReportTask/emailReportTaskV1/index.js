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
const ReportConfiguration_1 = require("./config/ReportConfiguration");
const ConfigurationProvider_1 = require("./config/ConfigurationProvider");
const ReportManager_1 = require("./ReportManager");
const ReportProvider_1 = require("./providers/ReportProvider");
const DataProviderFactory_1 = require("./providers/DataProviderFactory");
const HTMLReportCreator_1 = require("./htmlreport/HTMLReportCreator");
const EmailSender_1 = require("./EmailSender");
const ReportError_1 = require("./exceptions/ReportError");
const TelemetryLogger_1 = require("./telemetry/TelemetryLogger");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Node Version: ' + process.version);
            const configProvider = new ConfigurationProvider_1.ConfigurationProvider();
            const reportConfiguration = new ReportConfiguration_1.ReportConfiguration(configProvider);
            const reportProvider = new ReportProvider_1.ReportProvider(new DataProviderFactory_1.DataProviderFactory(configProvider.getPipelineConfiguration()));
            // Log telemetry: Task Inputs and Configuration
            TelemetryLogger_1.TelemetryLogger.LogTaskConfig(reportConfiguration);
            const reportManager = new ReportManager_1.ReportManager(reportProvider, new HTMLReportCreator_1.HTMLReportCreator(), new EmailSender_1.EmailSender());
            const mailSent = yield reportManager.sendReportAsync(reportConfiguration);
            if (mailSent) {
                // Wait for 10 sec and timeout
                let val = yield Promise.race([sleep(10000), setEmailSentVariable(mailSent)]);
                if (!val) {
                    console.log("Unable to set variable value in 10 sec. Exiting task.");
                }
            }
        }
        catch (err) {
            if (err instanceof ReportError_1.ReportError) {
                console.log(err.getMessage());
            }
            else {
                console.log(err);
            }
            // Fail task
            throw err;
        }
        finally {
            console.log("Task Processing Complete.");
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms, false));
}
function setEmailSentVariable(mailSent) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Setting EmailReportTask.EmailSent Variable value.");
        console.log(`##vso[task.setvariable variable=EmailReportTask.EmailSent;]${mailSent}`);
        console.log(`EmailReportTask.EmailSent Variable value set as ${mailSent}`);
        return true;
    });
}
run();
//# sourceMappingURL=index.js.map