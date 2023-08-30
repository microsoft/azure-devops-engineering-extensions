"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpConfiguration = void 0;
class SmtpConfiguration {
    constructor($userName, $password, $smtpHost, $enableTLS) {
        this.userName = $userName;
        this.password = $password;
        this.smtpHost = $smtpHost;
        this.enableTLS = $enableTLS;
    }
    /**
   * Getter $userName
   * @return {string}
   */
    get $userName() {
        return this.userName;
    }
    /**
     * Getter $password
     * @return {string}
     */
    get $password() {
        return this.password;
    }
    /**
     * Getter $smtpHost
     * @return {string}
     */
    get $smtpHost() {
        return this.smtpHost;
    }
    /**
     * Getter $enableSSL
     * @return {boolean}
     */
    get $enableTLS() {
        return this.enableTLS;
    }
}
exports.SmtpConfiguration = SmtpConfiguration;
//# sourceMappingURL=SmtpConfiguration.js.map