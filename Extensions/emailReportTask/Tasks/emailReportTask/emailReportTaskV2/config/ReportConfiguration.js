"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportConfiguration = void 0;
const InputError_1 = require("../exceptions/InputError");
const TaskConstants_1 = require("./TaskConstants");
const StringUtils_1 = require("../utils/StringUtils");
class ReportConfiguration {
    constructor(configProvider) {
        this.sendMailCondition = configProvider.getSendMailCondition();
        this.mailConfiguration = configProvider.getMailConfiguration();
        this.reportDataConfiguration = configProvider.getReportDataConfiguration();
        this.pipelineConfiguration = configProvider.getPipelineConfiguration();
    }
    validateConfiguration() {
        if (this.reportDataConfiguration.$testResultsConfig.$maxItemsToShow <= 0) {
            this.throwError(TaskConstants_1.TaskConstants.MAXTESTFAILURESTOSHOW_INPUTKEY, this.reportDataConfiguration.$testResultsConfig.$maxItemsToShow, "be > 0");
        }
        this.validateMailConfig();
    }
    validateMailConfig() {
        if (StringUtils_1.StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$mailSubject)) {
            this.throwError(TaskConstants_1.TaskConstants.SUBJECT_INPUTKEY, this.mailConfiguration.$mailSubject, "be specified");
        }
        if (StringUtils_1.StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$smtpConfig.$smtpHost)) {
            this.throwError(TaskConstants_1.TaskConstants.SMTPCONNECTION_INPUTKEY, this.mailConfiguration.$smtpConfig.$smtpHost, "specify SMTP Host URL");
        }
        if (StringUtils_1.StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$smtpConfig.$userName)) {
            this.throwError(TaskConstants_1.TaskConstants.SMTPCONNECTION_INPUTKEY, this.mailConfiguration.$smtpConfig.$userName, "specify SMTP UserName");
        }
        if (StringUtils_1.StringUtils.isNullOrWhiteSpace(this.mailConfiguration.$smtpConfig.$password)) {
            this.throwError(TaskConstants_1.TaskConstants.SMTPCONNECTION_INPUTKEY, this.mailConfiguration.$smtpConfig.$password, "specify SMTP Password");
        }
    }
    // Getters
    get $sendMailCondition() {
        return this.sendMailCondition;
    }
    get $mailConfiguration() {
        return this.mailConfiguration;
    }
    get $reportDataConfiguration() {
        return this.reportDataConfiguration;
    }
    get $pipelineConfiguration() {
        return this.pipelineConfiguration;
    }
    throwError(prefix, suffix, expectation) {
        throw new InputError_1.InputError(`${prefix} should ${expectation}. Actual Input value: '${suffix}'`);
    }
}
exports.ReportConfiguration = ReportConfiguration;
//# sourceMappingURL=ReportConfiguration.js.map