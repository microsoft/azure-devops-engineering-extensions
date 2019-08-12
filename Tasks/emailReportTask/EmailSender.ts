import { IReportSender } from "./IReportSender";
import { MailConfiguration } from "./config/mail/MailConfiguration";
import { MailAddressViewModel } from "./model/viewmodel/MailAddressViewModel";
import { Report } from "./model/Report";
const nodemailer = require("nodemailer");

export class EmailSender implements IReportSender {
  async sendReportAsync(report: Report, htmlReportMessage: string, mailConfiguration: MailConfiguration): Promise<void> {

    const mailAddressViewModel = new MailAddressViewModel(report, mailConfiguration);

    let transporter = nodemailer.createTransport({
      host: mailConfiguration.$smtpConfig.$smtpHost,
      port: 587,
      secure: mailConfiguration.$smtpConfig.$enableSSL, // SSL
      auth: {
        user: mailConfiguration.$smtpConfig.$userName,
        pass: mailConfiguration.$smtpConfig.$password
      }
    });

    // send mail
    await transporter.sendMail({
      from: mailAddressViewModel.from,
      to: mailAddressViewModel.to.join(","),
      subject: mailConfiguration.$mailSubject,
      html: htmlReportMessage
    },
      (err: any, response: any) => {
        if (err) {
          console.log(`Error Sending email via ${mailConfiguration.$smtpConfig.$smtpHost}: ${err}`);
        }
        console.log(`Response: ${response.response}`);
      });
  }
}