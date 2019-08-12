export class ReportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportError";
  }
}
