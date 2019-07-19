export class HostTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HostTypeError";
  }
}
