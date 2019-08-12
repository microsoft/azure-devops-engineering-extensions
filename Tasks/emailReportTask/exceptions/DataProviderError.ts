import { ReportError } from "./ReportError";

export class DataProviderError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = DataProviderError.name;
  }
}
