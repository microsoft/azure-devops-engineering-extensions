export declare class IssueModel {
    private message;
    private issueType;
    constructor($issueType: string, $message: string);
    /**
     * Getter $message
     * @return {string}
     */
    get $message(): string;
    /**
     * Getter $issueType
     * @return {string}
     */
    get $issueType(): string;
}
