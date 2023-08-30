"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeModel = void 0;
class ChangeModel {
    constructor($id, $author, $location, $timeStamp, $message) {
        this.id = $id;
        this.author = $author;
        this.location = $location;
        this.timeStamp = $timeStamp;
        this.message = $message;
    }
    /**
     * Getter $id
     * @return {string}
     */
    get $id() {
        return this.id;
    }
    /**
     * Getter $author
     * @return {IdentityRef}
     */
    get $author() {
        return this.author;
    }
    /**
     * Getter $location
     * @return {string}
     */
    get $location() {
        return this.location;
    }
    /**
     * Getter $timeStamp
     * @return {Date}
     */
    get $timeStamp() {
        return this.timeStamp;
    }
    /**
     * Getter $message
     * @return {string}
     */
    get $message() {
        return this.message;
    }
}
exports.ChangeModel = ChangeModel;
//# sourceMappingURL=ChangeModel.js.map