import { MailConfiguration } from "../../config/mail/MailConfiguration";
import { Report } from "../Report";
export declare class MailAddressViewModel {
    cc: string[];
    from: string;
    to: string[];
    private defaultDomain;
    constructor(report: Report, mailConfig: MailConfiguration);
    private getMailAddresses;
    private getFailedTestOwners;
    private getActiveBugOwnersForFailedTests;
    private getChangesetOwners;
    private filterValidMailAddresses;
    private getValidEmailAddress;
    private isValidEmail;
    private getMailAddressFromIdentityRef;
    private getUniqueName;
}
