import { IReportProvider } from "./IReportProvider";
import { ReportConfiguration } from "../config/ReportConfiguration";
import { Report } from "../model/Report";
import { IDataProviderFactory } from "./IDataProviderFactory";
import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
import { ReportFactory } from "../model/ReportFactory";
import { ReportError } from "../exceptions/ReportError";
import { DataProviderError } from "../exceptions/DataProviderError";
import { PostProcessorError } from "../exceptions/PostProcessorError";
import { TelemetryLogger } from "../telemetry/TelemetryLogger";

export class ReportProvider implements IReportProvider {

  private dataProviders: IDataProvider[] = [];
  private postProcessors: IPostProcessor[] = [];

  constructor(dataProviderFactory: IDataProviderFactory) {
    this.dataProviders.push(...dataProviderFactory.getDataProviders());
    this.postProcessors.push(...dataProviderFactory.getPostProcessors());
  }

  async createReportAsync(reportConfig: ReportConfiguration): Promise<Report> {
    let finalReport: Report;
    try {
      const reportTaskArray = this.dataProviders.map(dataProvider => TelemetryLogger.InvokeWithPerfLogger<Report>(async () => this.callDataProvider(dataProvider, reportConfig), dataProvider.constructor.name));

      const reports = await Promise.all(reportTaskArray);
      finalReport = ReportFactory.mergeReports(reports);

      // Post Process data collected
      const processorTasks = this.postProcessors.map(processor => TelemetryLogger.InvokeWithPerfLogger<boolean>(async () => this.callPostProcessor(processor, reportConfig, finalReport), processor.constructor.name));
      // Wait for all processors 
      await Promise.all(processorTasks);
    }
    catch (err) {
      ReportError.HandleError(err);
      if (finalReport == null) finalReport = ReportFactory.createNewReport(reportConfig.$pipelineConfiguration);
      finalReport.$dataMissing = true;
    }
    return finalReport;
  }

  private async callDataProvider(dataProvider: IDataProvider, reportConfig: ReportConfiguration): Promise<Report> {
    let report: Report = null;
    try {
      report = await dataProvider.getReportDataAsync(reportConfig.$pipelineConfiguration, reportConfig.$reportDataConfiguration);
    }
    catch (err) {
      // Do not error out until all data providers are done
      console.log(err);
      if (!(err instanceof ReportError)) {
        const reportError = new DataProviderError(`Error fetching data using ${dataProvider.constructor.name}: ${err.message}`);
        reportError.innerError = err;
        throw reportError;
      }
      throw err;
    }
    return report;
  }

  private async callPostProcessor(postProcessor: IPostProcessor, reportConfig: ReportConfiguration, report: Report): Promise<boolean> {
    let retVal = false;
    try {
      retVal = await postProcessor.processReportAsync(reportConfig, report);
    }
    catch (err) {
      // Do not error out until all post processors are done
      console.log(err);
      if (!(err instanceof ReportError)) {
        const reportError = new PostProcessorError(`Error fetching data using ${postProcessor.constructor.name}: ${err.message}`);
        reportError.innerError = err;
        throw reportError;
      }
      throw err;
    }
    return retVal;
  }
}