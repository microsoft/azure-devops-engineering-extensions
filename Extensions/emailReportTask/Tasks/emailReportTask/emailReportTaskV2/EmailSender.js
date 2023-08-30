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
exports.EmailSender = void 0;
const MailAddressViewModel_1 = require("./model/viewmodel/MailAddressViewModel");
const MailError_1 = require("./exceptions/MailError");
const util_1 = require("util");
const nodemailer = require("nodemailer");
const url = require("url");
class EmailSender {
    sendReportAsync(report, htmlReportMessage, mailConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailAddressViewModel = new MailAddressViewModel_1.MailAddressViewModel(report, mailConfiguration);
            let smtpUrlProvided = mailConfiguration.$smtpConfig.$smtpHost;
            console.log(`Using SmtpHost URL: ${smtpUrlProvided}`);
            smtpUrlProvided = smtpUrlProvided.includes("://") ? smtpUrlProvided : "smtp://" + smtpUrlProvided;
            console.log(`Parsed Url: ${smtpUrlProvided}`);
            let smtpUrl = url.parse(smtpUrlProvided, true);
            console.log(`Host: ${smtpUrl.host}`);
            console.log(`HostName: ${smtpUrl.hostname}`);
            console.log(`Port: ${smtpUrl.port}`);
            console.log(`Protocol: ${smtpUrl.protocol}`);
            const smtpHost = smtpUrl.hostname;
            let smtpPort = smtpUrl.port;
            smtpPort = util_1.isNullOrUndefined(smtpUrl.port) ? 587 : smtpUrl.port;
            console.log(`Using HostName: ${smtpHost} and port: ${smtpPort}`);
            let transporter;
            if (mailConfiguration.$smtpConfig.$enableTLS) {
                transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    tls: {
                        maxVersion: 'TLSv1.2',
                        minVersion: 'TLSv1.2',
                        rejectUnauthorized: false
                    },
                    requireTLS: true,
                    auth: {
                        user: mailConfiguration.$smtpConfig.$userName,
                        pass: mailConfiguration.$smtpConfig.$password
                    }
                });
            }
            else {
                transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    auth: {
                        user: mailConfiguration.$smtpConfig.$userName,
                        pass: mailConfiguration.$smtpConfig.$password
                    }
                });
            }
            try {
                const result = yield this.sendMailAsync(transporter, mailAddressViewModel, mailConfiguration, htmlReportMessage);
                console.log(`Mail Sent Successfully: ${result.response}`);
                return true;
            }
            catch (err) {
                throw new MailError_1.MailError(err);
            }
        });
    }
    sendMailAsync(transporter, mailAddressViewModel, mailConfiguration, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield transporter.sendMail({
                    from: mailAddressViewModel.from,
                    to: mailAddressViewModel.to.join(","),
                    cc: util_1.isNullOrUndefined(mailAddressViewModel.cc) || mailAddressViewModel.cc.length < 1 ? null : mailAddressViewModel.cc.join(","),
                    subject: mailConfiguration.$mailSubject,
                    html: message
                }, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                });
            }));
        });
    }
}
exports.EmailSender = EmailSender;
//# sourceMappingURL=EmailSender.js.map