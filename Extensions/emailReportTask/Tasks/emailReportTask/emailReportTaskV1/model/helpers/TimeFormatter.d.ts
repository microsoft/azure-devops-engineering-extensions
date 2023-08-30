export declare class TimeFormatter {
    static ConvertTimeStringToMilliSeconds(duration: string): number;
    static FormatDuration(timeInMilliseconds: number): string;
    static FormatDurationStr(timeStr: string): string;
    private static getCombinedTimeString;
    private static getTimeUnitString;
}
