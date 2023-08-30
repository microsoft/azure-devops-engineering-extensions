import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
export declare class ChangeModel {
    private id;
    private author;
    private location;
    private timeStamp;
    private message;
    constructor($id: string, $author: IdentityRef, $location: string, $timeStamp: Date, $message: string);
    /**
     * Getter $id
     * @return {string}
     */
    get $id(): string;
    /**
     * Getter $author
     * @return {IdentityRef}
     */
    get $author(): IdentityRef;
    /**
     * Getter $location
     * @return {string}
     */
    get $location(): string;
    /**
     * Getter $timeStamp
     * @return {Date}
     */
    get $timeStamp(): Date;
    /**
     * Getter $message
     * @return {string}
     */
    get $message(): string;
}
