import { ReportError } from "./ReportError";

export class InvalidTestResultDataError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = InvalidTestResultDataError.name;
  }
}
