import { IReportSender } from "./IReportSender";
import { MailConfiguration } from "./config/mail/MailConfiguration";
import { MailAddressViewModel } from "./model/viewmodel/MailAddressViewModel";
import { Report } from "./model/Report";
import { MailError } from "./exceptions/MailError";
import { isNullOrUndefined } from "util";
const nodemailer = require("nodemailer");

export class EmailSender implements IReportSender {
  public async sendReportAsync(report: Report, htmlReportMessage: string, mailConfiguration: MailConfiguration): Promise<boolean> {

    const mailAddressViewModel = new MailAddressViewModel(report, mailConfiguration);

    let transporter = nodemailer.createTransport({
      host: mailConfiguration.$smtpConfig.$smtpHost,
      port: 587,
      tls:  mailConfiguration.$smtpConfig.$enableTLS,
      auth: {
        user: mailConfiguration.$smtpConfig.$userName,
        pass: mailConfiguration.$smtpConfig.$password
      }
    });

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