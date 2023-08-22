export class SmtpConfiguration {
  private userName: string;
  private password: string;
  private smtpHost: string;
  private enableTLS: boolean;

  constructor($userName: string, $password: string, $smtpHost: string, $enableTLS: boolean) {
    this.userName = $userName;
    this.password = $password;
    this.smtpHost = $smtpHost;
    this.enableTLS = $enableTLS;
  }

  /**
 * Getter $userName
 * @return {string}
 */
  public get $userName(): string {
    return this.userName;
  }

  /**
   * Getter $password
   * @return {string}
   */
  public get $password(): string {
    return this.password;
  }

  /**
   * Getter $smtpHost
   * @return {string}
   */
  public get $smtpHost(): string {
    return this.smtpHost;
  }

  /**
   * Getter $enableSSL
   * @return {boolean}
   */
  public get $enableTLS(): boolean {
    return this.enableTLS;
  }
}