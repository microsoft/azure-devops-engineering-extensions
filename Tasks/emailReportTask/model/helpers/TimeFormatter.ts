import { isNullOrUndefined } from "util";

export class TimeFormatter {
  public static FormatDuration(timeInMilliseconds: number): string {
    let timeStr = "";
    // 1- Convert to seconds:
    var seconds = timeInMilliseconds / 1000;
    // 2- Extract hours:
    var hours = Math.round(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = Math.round(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    seconds = Math.round(seconds);
    return this.getCombinedTimeString(hours, minutes, seconds);
  }

  public static FormatDurationStr(timeStr: string): string {
    let resultStr = "";
    if (!isNullOrUndefined(timeStr)) {
      // strip off milliseconds if any, and then split into hh:mm:ss
      const timeStrArray = timeStr.split(".")[0].split(":");
      if (timeStrArray.length != 3) {
        // not supported
        return timeStr;
      }

      // 1- Convert to seconds:
      var seconds = Math.round(Number.parseInt(timeStrArray[2]));
      var minutes = Math.round(Number.parseInt(timeStrArray[1]));
      var hours = Math.round(Number.parseInt(timeStrArray[0]));

      resultStr = this.getCombinedTimeString(hours, minutes, seconds);
    }
    return resultStr;
  }

  private static getCombinedTimeString(hours: number, minutes: number, seconds: number): string {
    let timeStr = "";

    timeStr += this.getTimeUnitString(hours, "h");
    timeStr += this.getTimeUnitString(minutes, "m");
    timeStr += this.getTimeUnitString(seconds, "s");
    timeStr = timeStr.trim();

    return (timeStr == "" ? "0s" : timeStr);
  }

  private static getTimeUnitString(timeUnit: number, suffix: string): string {
    return timeUnit < 1 ? "" : timeUnit + suffix + " ";
  }
}