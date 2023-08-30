export declare class RecipientsConfiguration {
    private defaultRecipients;
    private includeChangesetOwners;
    private includeTestOwners;
    private includeActiveBugOwners;
    private includeCreatedBy;
    constructor($defaultRecipients: string, $includeChangesetOwners?: boolean, $includeTestOwners?: boolean, $includeActiveBugOwners?: boolean, $includeCreatedBy?: boolean);
    /**
     * Getter $defaultRecipients
     * @return {string}
     */
    get $defaultRecipients(): string;
    /**
     * Getter $includeChangesetOwners
     * @return {boolean}
     */
    get $includeChangesetOwners(): boolean;
    /**
     * Getter $includeTestOwners
     * @return {boolean}
     */
    get $includeTestOwners(): boolean;
    /**
     * Getter $includeActiveBugOwners
     * @return {boolean}
     */
    get $includeActiveBugOwners(): boolean;
    /**
     * Getter $includeCreatedBy
     * @return {boolean}
     */
    get $includeCreatedBy(): boolean;
}
