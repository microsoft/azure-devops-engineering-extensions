import { IReportProvider } from "./IReportProvider";
import { ReportConfiguration } from "../config/ReportConfiguration";
import { Report } from "../model/Report";
import { IDataProviderFactory } from "./IDataProviderFactory";
import { IDataProvider } from "./IDataProvider";
import { IPostProcessor } from "./IPostProcessor";
import { ReportFactory } from "../model/ReportFactory";

export class ReportProvider implements IReportProvider {

  private dataProviders: IDataProvider[] = [];
  private postProcessors: IPostProcessor[] = [];

  constructor(dataProviderFactory: IDataProviderFactory) {
    this.dataProviders.push(...dataProviderFactory.getDataProviders());
    this.postProcessors.push(...dataProviderFactory.getPostProcessors());
  }

  async createReportAsync(reportConfig: ReportConfiguration): Promise<Report> {
    let finalReport: Report;
    try
    {
      const reportTaskArray = this.dataProviders.map(dataProvider => dataProvider.getReportDataAsync(reportConfig.$pipelineConfiguration, reportConfig.$reportDataConfiguration));

      const reports = await Promise.all(reportTaskArray);
      finalReport = ReportFactory.mergeReports(reports);

      // Post Process data collected
      const processorTasks = this.postProcessors.map(processor => processor.processReportAsync(reportConfig, finalReport));
      // Wait for all processors 
      await Promise.all(processorTasks);
    }
    catch(err)
    {
      if(finalReport == null) finalReport = ReportFactory.createNewReport(reportConfig.$pipelineConfiguration);
      finalReport.$dataMissing = true;
      console.error(`Error while generating report: ${err}`);
    }
    return finalReport;
  }

}