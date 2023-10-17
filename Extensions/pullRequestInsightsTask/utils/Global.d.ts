/**
 * Declares additional format function for String
 */
export {};
declare global {
  interface String {
    format(...replacements: string[]): string;
    interpolate(): string;
  }
}
