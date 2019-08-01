/**
 * Exception to be thrown when the pipeline type task is running within is not recognized
 */
export class HostTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HostTypeError";
  }
}
