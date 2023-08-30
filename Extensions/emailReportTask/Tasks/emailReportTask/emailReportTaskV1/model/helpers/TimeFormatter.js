"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFormatter = void 0;
const util_1 = require("util");
class TimeFormatter {
    static ConvertTimeStringToMilliSeconds(duration) {
        const timeSpanArray = duration.split(".");
        let durationNum = 0;
        let hmsIndex = 0;
        if (timeSpanArray.length > 3) {
            console.warn("cannot format time duration");
            return 0;
        }
        else if (timeSpanArray.length == 3) {
            // Eg: 1.03:04:05.567 = 1 day, 3 hours, 4 min, 5 seconds and 567 ms. 
            // Days to ms
            durationNum += Number(timeSpanArray[0]) * 24 * 3600;
            hmsIndex = 1;
        }
        let timeStrArray = timeSpanArray[hmsIndex].split(":");
        if (timeStrArray.length != 3) {
            console.warn("cannot format time duration properly. test run duration will not be accurate");
        }
        else {
            durationNum += Number(timeStrArray[2]); // secs
            durationNum += Number(timeStrArray[1]) * 60; // mins to secs
            durationNum += Number(timeStrArray[0]) * 3600; // hours to secs
        }
        return durationNum * 1000;
    }
    static FormatDuration(timeInMilliseconds) {
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
        if (minutes == 60) {
            hours += 1;
            minutes = 0;
        }
        return this.getCombinedTimeString(hours, minutes, seconds);
    }
    static FormatDurationStr(timeStr) {
        let resultStr = "";
        if (!util_1.isNullOrUndefined(timeStr)) {
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
    static getCombinedTimeString(hours, minutes, seconds) {
        let timeStr = "";
        timeStr += this.getTimeUnitString(hours, "h");
        timeStr += this.getTimeUnitString(minutes, "m");
        timeStr += this.getTimeUnitString(seconds, "s");
        timeStr = timeStr.trim();
        return (timeStr == "" ? "0s" : timeStr);
    }
    static getTimeUnitString(timeUnit, suffix) {
        return timeUnit < 1 ? "" : timeUnit + suffix + " ";
    }
}
exports.TimeFormatter = TimeFormatter;
//# sourceMappingURL=TimeFormatter.js.map