import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

export class ChangeModel {

  private id: string;
  private author: IdentityRef;
  private location: string;
  private timeStamp: Date;
  private message: string;

  constructor($id: string, $author: IdentityRef, $location: string, $timeStamp: Date, $message: string) {
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
  public get $id(): string {
    return this.id;
  }

  /**
   * Getter $author
   * @return {IdentityRef}
   */
  public get $author(): IdentityRef {
    return this.author;
  }

  /**
   * Getter $location
   * @return {string}
   */
  public get $location(): string {
    return this.location;
  }

  /**
   * Getter $timeStamp
   * @return {Date}
   */
  public get $timeStamp(): Date {
    return this.timeStamp;
  }

  /**
   * Getter $message
   * @return {string}
   */
  public get $message(): string {
    return this.message;
  }
}