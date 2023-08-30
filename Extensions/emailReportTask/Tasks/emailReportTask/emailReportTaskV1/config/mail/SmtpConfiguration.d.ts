export declare class SmtpConfiguration {
    private userName;
    private password;
    private smtpHost;
    private enableTLS;
    constructor($userName: string, $password: string, $smtpHost: string, $enableTLS: boolean);
    /**
   * Getter $userName
   * @return {string}
   */
    get $userName(): string;
    /**
     * Getter $password
     * @return {string}
     */
    get $password(): string;
    /**
     * Getter $smtpHost
     * @return {string}
     */
    get $smtpHost(): string;
    /**
     * Getter $enableSSL
     * @return {boolean}
     */
    get $enableTLS(): boolean;
}
