"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientsConfiguration = void 0;
class RecipientsConfiguration {
    constructor($defaultRecipients, $includeChangesetOwners, $includeTestOwners, $includeActiveBugOwners, $includeCreatedBy) {
        this.defaultRecipients = $defaultRecipients;
        this.includeChangesetOwners = $includeChangesetOwners;
        this.includeTestOwners = $includeTestOwners;
        this.includeActiveBugOwners = $includeActiveBugOwners;
        this.includeCreatedBy = $includeCreatedBy;
    }
    /**
     * Getter $defaultRecipients
     * @return {string}
     */
    get $defaultRecipients() {
        return this.defaultRecipients;
    }
    /**
     * Getter $includeChangesetOwners
     * @return {boolean}
     */
    get $includeChangesetOwners() {
        return this.includeChangesetOwners;
    }
    /**
     * Getter $includeTestOwners
     * @return {boolean}
     */
    get $includeTestOwners() {
        return this.includeTestOwners;
    }
    /**
     * Getter $includeActiveBugOwners
     * @return {boolean}
     */
    get $includeActiveBugOwners() {
        return this.includeActiveBugOwners;
    }
    /**
     * Getter $includeCreatedBy
     * @return {boolean}
     */
    get $includeCreatedBy() {
        return this.includeCreatedBy;
    }
}
exports.RecipientsConfiguration = RecipientsConfiguration;
//# sourceMappingURL=RecipientsConfiguration.js.map