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
exports.TelemetryLogger = void 0;
const PipelineType_1 = require("../config/pipeline/PipelineType");
const EnumUtils_1 = require("../utils/EnumUtils");
const now = require("performance-now");
class TelemetryLogger {
    /**
     * Formats and sends all telemetry collected to be published
     */
    static LogTaskConfig(reportConfiguration) {
        this.reportConfig = reportConfiguration;
        const pipelineConfig = this.reportConfig.$pipelineConfiguration;
        const mailConfig = this.reportConfig.$mailConfiguration;
        const reportDataConfig = this.reportConfig.$reportDataConfiguration;
        let pipelineTypeString = "Release";
        let environmentId = 0;
        if (pipelineConfig.$pipelineType == PipelineType_1.PipelineType.Build) {
            pipelineTypeString = "Build";
        }
        else {
            environmentId = pipelineConfig.$environmentId;
        }
        const groupTestSummary = reportDataConfig.$groupTestSummaryBy.map(g => EnumUtils_1.EnumUtils.GetGroupTestResultsByString(g));
        let groupTestSummaryString = groupTestSummary[0];
        if (groupTestSummary.length > 0) {
            groupTestSummaryString = groupTestSummary.join(",");
        }
        this.logTelemetry({
            pipelineId: pipelineConfig.$pipelineId,
            pipelineType: pipelineTypeString,
            projectId: pipelineConfig.$projectId,
            projectName: pipelineConfig.$projectName,
            environmentId: environmentId,
            taskConfiguration: {
                sendMailCondition: EnumUtils_1.EnumUtils.GetMailConditionString(this.reportConfig.$sendMailCondition),
                smtpHost: mailConfig.$smtpConfig.$smtpHost,
                smtpUserName: mailConfig.$smtpConfig.$userName,
                enableTLs: mailConfig.$smtpConfig.$enableTLS,
                includeCommits: reportDataConfig.$includeCommits,
                includeOthersInTotal: reportDataConfig.$includeOthersInTotal,
                groupTestSummaryBy: groupTestSummaryString,
                testResultsConfiguration: {
                    includeFailedTests: reportDataConfig.$testResultsConfig.$includeFailedTests,
                    includeInconclusiveTests: reportDataConfig.$testResultsConfig.$includeInconclusiveTests,
                    includeNotExecutedTests: reportDataConfig.$testResultsConfig.$includeNotExecutedTests,
                    includeOtherTests: reportDataConfig.$testResultsConfig.$includeOtherTests,
                    includePassedTests: reportDataConfig.$testResultsConfig.$includePassedTests,
                    maxItemsToShow: reportDataConfig.$testResultsConfig.$maxItemsToShow
                }
            }
        });
    }
    static LogModulePerf(moduleName, timeTaken, numRetries = 0) {
        const timeTakenString = timeTaken.toFixed(2);
        if (numRetries < 1) {
            this.logTelemetry({
                "ModuleName": `${moduleName}`,
                "PERF": `${timeTakenString}`
            });
        }
        else {
            this.logTelemetry({
                "ModuleName": `${moduleName}`,
                "PERF": `${timeTakenString}`,
                "Retries": `${numRetries}`
            });
        }
    }
    /**
     * Publishes an object as a string as telemetry
     * @param telemetryToLog Object to be logged as a string
     */
    static logTelemetry(telemetryToLog) {
        console.log(TelemetryLogger.TELEMETRY_LINE + JSON.stringify(telemetryToLog));
    }
    static InvokeWithPerfLogger(executor, executorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const perfStart = now();
            let returnVal;
            try {
                returnVal = yield executor();
            }
            finally {
                // Log time taken by the dataprovider
                TelemetryLogger.LogModulePerf(executorName, now() - perfStart);
            }
            return returnVal;
        });
    }
}
exports.TelemetryLogger = TelemetryLogger;
TelemetryLogger.TELEMETRY_LINE = "##vso[telemetry.publish area=AgentTasks;feature=EmailReportTask]";
//# sourceMappingURL=TelemetryLogger.js.map