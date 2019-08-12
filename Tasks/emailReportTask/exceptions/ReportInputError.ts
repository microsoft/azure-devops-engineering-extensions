export class ReportInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}
