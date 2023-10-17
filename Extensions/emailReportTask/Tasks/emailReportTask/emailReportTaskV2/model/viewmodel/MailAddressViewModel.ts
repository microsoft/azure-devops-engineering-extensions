import { MailConfiguration } from "../../config/mail/MailConfiguration";
import { Report } from "../Report";
import { RecipientsConfiguration } from "../../config/mail/RecipientsConfiguration";
import { isNullOrUndefined } from "util";
import { IdentityRef } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { StringUtils } from "../../utils/StringUtils";
import { TestOutcome } from "azure-devops-node-api/interfaces/TestInterfaces";
import { ChangeModel } from "../ChangeModel";

export class MailAddressViewModel {
  public cc: string[] = [];

  public from: string;
  public to: string[] = [];

  private defaultDomain: string;

  constructor(report: Report, mailConfig: MailConfiguration) {
    this.from = mailConfig.$smtpConfig.$userName;
    this.defaultDomain = mailConfig.$defaultDomain;

    console.log("computing email addresses for to section");
    this.to = this.getMailAddresses(report, mailConfig.$toRecipientsConfig);

    console.log("computing email addresses for Cc section");
    this.cc = this.getMailAddresses(report, mailConfig.$ccRecipientsConfig);
  }

  private getMailAddresses(report: Report, recipientsConfiguration: RecipientsConfiguration): string[] {
    var addressHashSet = new Set<string>();

    if (recipientsConfiguration.$includeTestOwners) {
      const owners = this.getFailedTestOwners(report);
      owners.forEach(o => addressHashSet.add(o));
    }

    if (recipientsConfiguration.$includeActiveBugOwners) {
      const bugOwners = this.getActiveBugOwnersForFailedTests(report);
      bugOwners.forEach(o => addressHashSet.add(o));
    }

    if (recipientsConfiguration.$includeChangesetOwners) {
      const changesetOwners = this.getChangesetOwners(report.$associatedChanges);
      changesetOwners.forEach(o => addressHashSet.add(o));
    }

    if (recipientsConfiguration.$includeCreatedBy) {
      if (!isNullOrUndefined(report.createdBy)) {
        addressHashSet.add(report.createdBy.uniqueName);
      }
    }

    if(!isNullOrUndefined(recipientsConfiguration.$defaultRecipients)) {
      recipientsConfiguration.$defaultRecipients.split(";").forEach(a => addressHashSet.add(a));
    }
    return this.filterValidMailAddresses(addressHashSet);
  }

  private getFailedTestOwners(report: Report): string[] {
    var mailAddresses: string[] = [];
    if (!isNullOrUndefined(report.$failedTestOwners)) {
      report.$failedTestOwners.forEach(identity => {
        var mailAddress = this.getMailAddressFromIdentityRef(identity);
        if (!StringUtils.isNullOrWhiteSpace(mailAddress)) {
          mailAddresses.push(mailAddress);
        }
      });
    }

    console.log(`Failed Test owners - ${mailAddresses.join(",")}`);
    return mailAddresses;
  }

  private getActiveBugOwnersForFailedTests(report: Report): string[] {
    if (report.filteredResults == null) {
      return [];
    }

    const bugOwners: string[] = [];

    report.filteredResults.forEach(group => {
      if (group.testResults.has(TestOutcome.Failed)) {
        group.testResults.forEach(tr => {
          tr.forEach(tr => {
            tr.associatedBugs.forEach(bug => {
              const bugState = bug.fields["System.State"] as string;
              if (!isNullOrUndefined(bugState) && bugState.toLowerCase() == "Active".toLowerCase()) {
                bugOwners.push(bug.fields["System.AssignedTo"]);
              }
            });
          });
        });
      }
    });

    console.log(`Failed Test owners - ${bugOwners.join(",")}`);
    return bugOwners;
  }

  private getChangesetOwners(associatedChanges: ChangeModel[]): string[] {
    var mailAddresses: string[] = [];
    if (!isNullOrUndefined(associatedChanges) && associatedChanges.length < 1) {
      console.log("No changeset owner mail addresses");
      return mailAddresses;
    }

    associatedChanges.forEach(associatedChange => {
      var mailAddress = associatedChange.$author.uniqueName;
      if (StringUtils.isNullOrWhiteSpace(mailAddress)) {
        console.log(`Unable to get mail address for associated change - ${associatedChange.$id}`);
      }
      else {
        mailAddresses.push(mailAddress);
      }
    });

    console.log(`Changeset owner mail addresses - ${mailAddresses.join(",")}`);
    return mailAddresses;
  }

  private filterValidMailAddresses(addressHashSet: Set<string>): string[] {
    var mailAddresses: string[] = [];
    addressHashSet.forEach(address => {
      var validAddress = this.getValidEmailAddress(address);
      if (!StringUtils.isNullOrWhiteSpace(validAddress)) {
        mailAddresses.push(validAddress);
      }
    });
    return mailAddresses;
  }

  private getValidEmailAddress(address: string): string {
    if (!StringUtils.isNullOrWhiteSpace(address) && !this.isValidEmail(address)) {
      console.log(`Address ${address} is not a valid email address. Adding domain: ${this.defaultDomain}`);
      address = `${address}@${this.defaultDomain}`;
    }

    return address;
  }

  private isValidEmail(email: string): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
  }

  private getMailAddressFromIdentityRef(identity: IdentityRef): string {
    if (!identity.isContainer) {
      return this.getUniqueName(identity);
    }

    console.log(`Not fetching email address for container - ${identity.displayName}`);
    return null;
  }

  private getUniqueName(identity: IdentityRef): string {
    return identity.uniqueName == null ? identity.displayName : identity.uniqueName;
  }
}