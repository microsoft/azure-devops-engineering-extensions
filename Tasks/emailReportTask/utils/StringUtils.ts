export class StringUtils {
  public static isNullOrWhiteSpace( input: string ) : boolean {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace("/\s/g", '').length < 1;
  }

  public static CompressNewLines(content: string): string {
    if (content != null)
    {
      const lines = this.getNonEmptyLines(content);
      content = lines.join("\n");
    }
    return content;
  }

  private static getNonEmptyLines(s: string): string[]
  {
      s = s.replace("\r", "");
      return s.split('\n')
          .filter(str => !this.isNullOrWhiteSpace(str))
          .map(str => str.trim());
  }

  public static ReplaceNewlineWithBrTag(content: string): string {
    if (content == null)
    {
        return null;
    }

    const lines = this.getNonEmptyLines(content);
    return lines.join("<br/>");
  }

  public static getFirstNLines(content: string, lineCount: number): string {
    if (content != null)
    {
        var lines = this.getNonEmptyLines(content);
        return lines.slice(0, lineCount).join("\n");
    }
    return null;
  }
}