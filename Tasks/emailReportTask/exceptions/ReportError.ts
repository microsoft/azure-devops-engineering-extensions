export abstract class ReportError extends Error {
  constructor(message: string) {
    super(message); 
  }

  public getMessage(): string {
    return `${this.name}: ${this.message}\r\n ${this.stack}`;
  }
}
