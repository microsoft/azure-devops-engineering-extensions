export class RecipientsConfiguration
{
  private defaultRecipients: string;
  private includeChangesetOwners : boolean;
  private includeTestOwners : boolean;
  private includeActiveBugOwners : boolean;
  private includeCreatedBy : boolean;
 
  constructor($defaultRecipients: string, $includeChangesetOwners?: boolean, $includeTestOwners?: boolean, $includeActiveBugOwners?: boolean, $includeCreatedBy?: boolean) {
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
	public get $defaultRecipients(): string {
		return this.defaultRecipients;
	}

    /**
     * Getter $includeChangesetOwners
     * @return {boolean}
     */
	public get $includeChangesetOwners(): boolean {
		return this.includeChangesetOwners;
	}

    /**
     * Getter $includeTestOwners
     * @return {boolean}
     */
	public get $includeTestOwners(): boolean {
		return this.includeTestOwners;
	}

    /**
     * Getter $includeActiveBugOwners
     * @return {boolean}
     */
	public get $includeActiveBugOwners(): boolean {
		return this.includeActiveBugOwners;
	}

    /**
     * Getter $includeCreatedBy
     * @return {boolean}
     */
	public get $includeCreatedBy(): boolean {
		return this.includeCreatedBy;
	}
}