import { ReportError } from "./ReportError";

export class InputError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = InputError.name;
  }
}
