export class DataProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataProviderError";
  }
}
