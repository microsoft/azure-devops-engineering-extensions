"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueModel = void 0;
class IssueModel {
    constructor($issueType, $message) {
        this.message = $message;
        this.issueType = $issueType;
    }
    /**
     * Getter $message
     * @return {string}
     */
    get $message() {
        return this.message;
    }
    /**
     * Getter $issueType
     * @return {string}
     */
    get $issueType() {
        return this.issueType;
    }
}
exports.IssueModel = IssueModel;
//# sourceMappingURL=IssueModel.js.map