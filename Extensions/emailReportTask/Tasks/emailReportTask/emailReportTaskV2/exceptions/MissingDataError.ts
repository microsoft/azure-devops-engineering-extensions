import { ReportError } from "./ReportError";

export class MissingDataError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = MissingDataError.name;
  }
}
