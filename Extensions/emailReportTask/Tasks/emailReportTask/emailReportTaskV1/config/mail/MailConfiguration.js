"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailConfiguration = void 0;
class MailConfiguration {
    constructor($mailSubject, $toRecipientsConfig, $ccRecipientsConfig, $smtpConfig, $defaultDomain) {
        this.mailSubject = $mailSubject;
        this.toRecipientsConfig = $toRecipientsConfig;
        this.ccRecipientsConfig = $ccRecipientsConfig;
        this.smtpConfig = $smtpConfig;
        this.defaultDomain = $defaultDomain;
    }
    /**
     * Getter $defaultDomain
     * @return {string}
     */
    get $defaultDomain() {
        return this.defaultDomain;
    }
    /**
     * Getter $mailSubject
     * @return {string}
     */
    get $mailSubject() {
        return this.mailSubject;
    }
    /**
     * Getter $ccRecipientsConfig
     * @return {RecipientsConfiguration}
     */
    get $ccRecipientsConfig() {
        return this.ccRecipientsConfig;
    }
    /**
     * Getter $smtpConfig
     * @return {SmtpConfiguration}
     */
    get $smtpConfig() {
        return this.smtpConfig;
    }
    /**
     * Getter $toRecipientsConfig
     * @return {RecipientsConfiguration}
     */
    get $toRecipientsConfig() {
        return this.toRecipientsConfig;
    }
    /**
   * Setter $mailSubject
   * @param {string} value
   */
    set $mailSubject(value) {
        this.mailSubject = value;
    }
}
exports.MailConfiguration = MailConfiguration;
//# sourceMappingURL=MailConfiguration.js.map