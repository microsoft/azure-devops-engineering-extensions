import { ReportError } from "./ReportError";

export class PostProcessorError extends ReportError {
  constructor(message: string) {
    super(message);
    this.name = PostProcessorError.name;
  }
}