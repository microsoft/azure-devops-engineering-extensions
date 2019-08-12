export class InvalidTestResultDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTestResultDataError";
  }
}
