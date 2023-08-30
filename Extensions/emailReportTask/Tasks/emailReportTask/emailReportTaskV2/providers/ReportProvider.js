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
exports.ReportProvider = void 0;
const ReportFactory_1 = require("../model/ReportFactory");
const ReportError_1 = require("../exceptions/ReportError");
const DataProviderError_1 = require("../exceptions/DataProviderError");
const PostProcessorError_1 = require("../exceptions/PostProcessorError");
const TelemetryLogger_1 = require("../telemetry/TelemetryLogger");
class ReportProvider {
    constructor(dataProviderFactory) {
        this.dataProviders = [];
        this.postProcessors = [];
        this.dataProviders.push(...dataProviderFactory.getDataProviders());
        this.postProcessors.push(...dataProviderFactory.getPostProcessors());
    }
    createReportAsync(reportConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalReport;
            try {
                const reportTaskArray = this.dataProviders.map(dataProvider => TelemetryLogger_1.TelemetryLogger.InvokeWithPerfLogger(() => __awaiter(this, void 0, void 0, function* () { return this.callDataProvider(dataProvider, reportConfig); }), dataProvider.constructor.name));
                const reports = yield Promise.all(reportTaskArray);
                finalReport = ReportFactory_1.ReportFactory.mergeReports(reports);
                // Post Process data collected
                const processorTasks = this.postProcessors.map(processor => TelemetryLogger_1.TelemetryLogger.InvokeWithPerfLogger(() => __awaiter(this, void 0, void 0, function* () { return this.callPostProcessor(processor, reportConfig, finalReport); }), processor.constructor.name));
                // Wait for all processors 
                yield Promise.all(processorTasks);
            }
            catch (err) {
                ReportError_1.ReportError.HandleError(err);
                if (finalReport == null)
                    finalReport = ReportFactory_1.ReportFactory.createNewReport(reportConfig.$pipelineConfiguration);
                finalReport.$dataMissing = true;
            }
            return finalReport;
        });
    }
    callDataProvider(dataProvider, reportConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let report = null;
            try {
                report = yield dataProvider.getReportDataAsync(reportConfig.$pipelineConfiguration, reportConfig.$reportDataConfiguration);
            }
            catch (err) {
                // Do not error out until all data providers are done
                console.log(err);
                if (!(err instanceof ReportError_1.ReportError)) {
                    const reportError = new DataProviderError_1.DataProviderError(`Error fetching data using ${dataProvider.constructor.name}: ${err.message}`);
                    reportError.innerError = err;
                    throw reportError;
                }
                throw err;
            }
            return report;
        });
    }
    callPostProcessor(postProcessor, reportConfig, report) {
        return __awaiter(this, void 0, void 0, function* () {
            let retVal = false;
            try {
                retVal = yield postProcessor.processReportAsync(reportConfig, report);
            }
            catch (err) {
                // Do not error out until all post processors are done
                console.log(err);
                if (!(err instanceof ReportError_1.ReportError)) {
                    const reportError = new PostProcessorError_1.PostProcessorError(`Error fetching data using ${postProcessor.constructor.name}: ${err.message}`);
                    reportError.innerError = err;
                    throw reportError;
                }
                throw err;
            }
            return retVal;
        });
    }
}
exports.ReportProvider = ReportProvider;
//# sourceMappingURL=ReportProvider.js.map