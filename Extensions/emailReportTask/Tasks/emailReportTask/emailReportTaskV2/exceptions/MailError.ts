import { ReportError } from "./ReportError";

export class MailError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = MailError.name;
  }
}