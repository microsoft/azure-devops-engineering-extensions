export declare class StringUtils {
    static isNullOrWhiteSpace(input: string): boolean;
    static CompressNewLines(content: string): string;
    private static getNonEmptyLines;
    static ReplaceNewlineWithBrTag(content: string): string;
    static getFirstNLines(content: string, lineCount: number): string;
}
