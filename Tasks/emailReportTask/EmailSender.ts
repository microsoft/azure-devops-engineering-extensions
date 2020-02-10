import { IReportSender } from "./IReportSender";
import { MailConfiguration } from "./config/mail/MailConfiguration";
import { MailAddressViewModel } from "./model/viewmodel/MailAddressViewModel";
import { Report } from "./model/Report";
import { MailError } from "./exceptions/MailError";
import { isNullOrUndefined } from "util";
const nodemailer = require("nodemailer");
const url = require("url");

export class EmailSender implements IReportSender {
  public async sendReportAsync(report: Report, htmlReportMessage: string, mailConfiguration: MailConfiguration): Promise<boolean> {
    const mailAddressViewModel = new MailAddressViewModel(report, mailConfiguration);

    let smtpUrl = url.parse(mailConfiguration.$smtpConfig.$smtpHost, true);
    if(isNullOrUndefined(smtpUrl.protocol)) {
      // Protocol not provided in url 
      // Add protocol so that url.parse can work as it requires protocol in url to be able to parse
      smtpUrl = url.parse("smtp://" + mailConfiguration.$smtpConfig.$smtpHost, true);
    }

    const smtpHost = smtpUrl.hostname;
    let smtpPort = smtpUrl.port;
    smtpPort = isNullOrUndefined(smtpUrl.port) ? 587 : smtpUrl.port;

    let transporter: any;
    if(mailConfiguration.$smtpConfig.$enableTLS) {      
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
      const result = await this.sendMailAsync(transporter, mailAddressViewModel, mailConfiguration, htmlReportMessage);
      console.log(`Mail Sent Successfully: ${result.response}`);
      return true;
    } catch(err) {
      throw new MailError(err);
    }
  }

  private async sendMailAsync(transporter: any, 
    mailAddressViewModel: MailAddressViewModel, 
    mailConfiguration: MailConfiguration, 
    message: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await transporter.sendMail({
        from: mailAddressViewModel.from,
        to: mailAddressViewModel.to.join(","),
        cc: isNullOrUndefined(mailAddressViewModel.cc) || mailAddressViewModel.cc.length < 1 ? null : mailAddressViewModel.cc.join(","),
        subject: mailConfiguration.$mailSubject,
        html: message
      },
        (err: any, response: any) => {
          if (err){
            reject(err);
          } else {
            resolve(response);
          }
      });
    });
  }
}