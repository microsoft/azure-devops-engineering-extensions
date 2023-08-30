import { ReportConfiguration } from "../config/ReportConfiguration";
export declare class TelemetryLogger {
    static readonly TELEMETRY_LINE = "##vso[telemetry.publish area=AgentTasks;feature=EmailReportTask]";
    private static instance;
    private static reportConfig;
    /**
     * Formats and sends all telemetry collected to be published
     */
    static LogTaskConfig(reportConfiguration: ReportConfiguration): void;
    static LogModulePerf(moduleName: string, timeTaken: number, numRetries?: Number): void;
    /**
     * Publishes an object as a string as telemetry
     * @param telemetryToLog Object to be logged as a string
     */
    private static logTelemetry;
    static InvokeWithPerfLogger<T>(executor: () => Promise<T>, executorName: string): Promise<T>;
}
