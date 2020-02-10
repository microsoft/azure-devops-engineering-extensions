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
    smtpPort = isNullOrUndefined(smtpUrl.port) ? 587 : smtpUrl.port;

    console.log(`Using HostName: ${smtpHost} and port: ${smtpPort}`);

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