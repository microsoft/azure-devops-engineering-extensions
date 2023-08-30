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
exports.ReportManager = void 0;
const ReportError_1 = require("./exceptions/ReportError");
const MissingDataError_1 = require("./exceptions/MissingDataError");
const EnumUtils_1 = require("./utils/EnumUtils");
class ReportManager {
    constructor(reportProvider, htmlReportCreator, reportSender) {
        this.reportProvider = reportProvider;
        this.reportSender = reportSender;
        this.htmlReportCreator = htmlReportCreator;
    }
    sendReportAsync(reportConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let mailSent = false;
            try {
                console.log("Fetching data for email report");
                const report = yield this.reportProvider.createReportAsync(reportConfig);
                console.log("Created report view model");
                if (report.$dataMissing) {
                    throw new MissingDataError_1.MissingDataError("Unable to fetch all data for generating report. Not Sending report.");
                }
                else if (report.$sendMailConditionSatisfied && this.reportSender != null) {
                    console.log("Creating report message");
                    const htmlMessage = this.htmlReportCreator.createHtmlReport(report, reportConfig);
                    mailSent = yield this.reportSender.sendReportAsync(report, htmlMessage, reportConfig.$mailConfiguration);
                }
                else {
                    console.log(`Not sending mail, as the user send mail condition - '${EnumUtils_1.EnumUtils.GetMailConditionString(reportConfig.$sendMailCondition)}' is not satisfied.`);
                }
            }
            catch (err) {
                // Exit Task with Error to fail the task
                ReportError_1.ReportError.HandleError(err, true);
            }
            return mailSent;
        });
    }
}
exports.ReportManager = ReportManager;
//# sourceMappingURL=ReportManager.js.map