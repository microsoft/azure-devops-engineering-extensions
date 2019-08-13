import { isNullOrUndefined } from "util";

export abstract class ReportError extends Error {
  public innerError: any;
  constructor(message: string) {
    super(message); 
  }
  
  public getMessage(): string {
    const stack = isNullOrUndefined(this.innerError) || isNullOrUndefined(this.innerError.stack) ? this.stack :
      `${this.stack}\r\nInnerError:${this.innerError.message}: ${this.innerError.stack}`
    return `${this.name}: ${this.message}\r\n ${stack}`;
  }

  public static HandleError(err: Error, rethrow: boolean = false): void {
    if(err instanceof ReportError) {
      console.error((err as ReportError).getMessage());
    } else {
      console.error(err);
    }

    if(rethrow) {
      throw err;
    }
  }
}
