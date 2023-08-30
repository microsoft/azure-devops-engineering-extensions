export class IssueModel {

  private message: string;
  private issueType: string;

  constructor($issueType: string, $message: string) {
    this.message = $message;
    this.issueType = $issueType;
  }

  /**
   * Getter $message
   * @return {string}
   */
  public get $message(): string {
    return this.message;
  }

  /**
   * Getter $issueType
   * @return {string}
   */
  public get $issueType(): string {
    return this.issueType;
  }
}