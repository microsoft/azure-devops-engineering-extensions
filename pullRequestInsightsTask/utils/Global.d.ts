export {};
declare global {
  interface String {
    format(...replacements: string[]): string;
    interpolate(): string;
  }
}
