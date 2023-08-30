import { RecipientsConfiguration } from "./RecipientsConfiguration";
import { SmtpConfiguration } from "./SmtpConfiguration";
export declare class MailConfiguration {
    private mailSubject;
    private toRecipientsConfig;
    private ccRecipientsConfig;
    private smtpConfig;
    private defaultDomain;
    constructor($mailSubject: string, $toRecipientsConfig: RecipientsConfiguration, $ccRecipientsConfig: RecipientsConfiguration, $smtpConfig: SmtpConfiguration, $defaultDomain: string);
    /**
     * Getter $defaultDomain
     * @return {string}
     */
    get $defaultDomain(): string;
    /**
     * Getter $mailSubject
     * @return {string}
     */
    get $mailSubject(): string;
    /**
     * Getter $ccRecipientsConfig
     * @return {RecipientsConfiguration}
     */
    get $ccRecipientsConfig(): RecipientsConfiguration;
    /**
     * Getter $smtpConfig
     * @return {SmtpConfiguration}
     */
    get $smtpConfig(): SmtpConfiguration;
    /**
     * Getter $toRecipientsConfig
     * @return {RecipientsConfiguration}
     */
    get $toRecipientsConfig(): RecipientsConfiguration;
    /**
   * Setter $mailSubject
   * @param {string} value
   */
    set $mailSubject(value: string);
}
