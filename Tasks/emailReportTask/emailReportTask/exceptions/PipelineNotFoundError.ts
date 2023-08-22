import { ReportError } from "./ReportError";

export class PipelineNotFoundError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = "PipelineNotFoundError";
  }
}
