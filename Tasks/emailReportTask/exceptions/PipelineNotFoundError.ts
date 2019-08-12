export class PipelineNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}
