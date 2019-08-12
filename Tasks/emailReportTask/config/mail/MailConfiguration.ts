import { RecipientsConfiguration } from "./RecipientsConfiguration";
import { SmtpConfiguration } from "./SmtpConfiguration";

export class MailConfiguration {

  private mailSubject: string;
  private toRecipientsConfig: RecipientsConfiguration;
  private ccRecipientsConfig: RecipientsConfiguration;
  private smtpConfig: SmtpConfiguration;
  private defaultDomain: string;

  constructor($mailSubject: string, $toRecipientsConfig: RecipientsConfiguration, $ccRecipientsConfig: RecipientsConfiguration, $smtpConfig: SmtpConfiguration, $defaultDomain: string) {
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
  public get $defaultDomain(): string {
    return this.defaultDomain;
  }

  /**
   * Getter $mailSubject
   * @return {string}
   */
  public get $mailSubject(): string {
    return this.mailSubject;
  }

  /**
   * Getter $ccRecipientsConfig
   * @return {RecipientsConfiguration}
   */
  public get $ccRecipientsConfig(): RecipientsConfiguration {
    return this.ccRecipientsConfig;
  }

  /**
   * Getter $smtpConfig
   * @return {SmtpConfiguration}
   */
  public get $smtpConfig(): SmtpConfiguration {
    return this.smtpConfig;
  }

  /**
   * Getter $toRecipientsConfig
   * @return {RecipientsConfiguration}
   */
  public get $toRecipientsConfig(): RecipientsConfiguration {
    return this.toRecipientsConfig;
  }
}