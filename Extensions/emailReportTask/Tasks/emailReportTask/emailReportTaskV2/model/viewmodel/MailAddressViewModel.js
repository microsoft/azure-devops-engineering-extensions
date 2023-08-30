"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailAddressViewModel = void 0;
const util_1 = require("util");
const StringUtils_1 = require("../../utils/StringUtils");
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
class MailAddressViewModel {
    constructor(report, mailConfig) {
        this.cc = [];
        this.to = [];
        this.from = mailConfig.$smtpConfig.$userName;
        this.defaultDomain = mailConfig.$defaultDomain;
        console.log("computing email addresses for to section");
        this.to = this.getMailAddresses(report, mailConfig.$toRecipientsConfig);
        console.log("computing email addresses for Cc section");
        this.cc = this.getMailAddresses(report, mailConfig.$ccRecipientsConfig);
    }
    getMailAddresses(report, recipientsConfiguration) {
        var addressHashSet = new Set();
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
            if (!util_1.isNullOrUndefined(report.createdBy)) {
                addressHashSet.add(report.createdBy.uniqueName);
            }
        }
        if (!util_1.isNullOrUndefined(recipientsConfiguration.$defaultRecipients)) {
            recipientsConfiguration.$defaultRecipients.split(";").forEach(a => addressHashSet.add(a));
        }
        return this.filterValidMailAddresses(addressHashSet);
    }
    getFailedTestOwners(report) {
        var mailAddresses = [];
        if (!util_1.isNullOrUndefined(report.$failedTestOwners)) {
            report.$failedTestOwners.forEach(identity => {
                var mailAddress = this.getMailAddressFromIdentityRef(identity);
                if (!StringUtils_1.StringUtils.isNullOrWhiteSpace(mailAddress)) {
                    mailAddresses.push(mailAddress);
                }
            });
        }
        console.log(`Failed Test owners - ${mailAddresses.join(",")}`);
        return mailAddresses;
    }
    getActiveBugOwnersForFailedTests(report) {
        if (report.filteredResults == null) {
            return [];
        }
        const bugOwners = [];
        report.filteredResults.forEach(group => {
            if (group.testResults.has(TestInterfaces_1.TestOutcome.Failed)) {
                group.testResults.forEach(tr => {
                    tr.forEach(tr => {
                        tr.associatedBugs.forEach(bug => {
                            const bugState = bug.fields["System.State"];
                            if (!util_1.isNullOrUndefined(bugState) && bugState.toLowerCase() == "Active".toLowerCase()) {
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
    getChangesetOwners(associatedChanges) {
        var mailAddresses = [];
        if (!util_1.isNullOrUndefined(associatedChanges) && associatedChanges.length < 1) {
            console.log("No changeset owner mail addresses");
            return mailAddresses;
        }
        associatedChanges.forEach(associatedChange => {
            var mailAddress = associatedChange.$author.uniqueName;
            if (StringUtils_1.StringUtils.isNullOrWhiteSpace(mailAddress)) {
                console.log(`Unable to get mail address for associated change - ${associatedChange.$id}`);
            }
            else {
                mailAddresses.push(mailAddress);
            }
        });
        console.log(`Changeset owner mail addresses - ${mailAddresses.join(",")}`);
        return mailAddresses;
    }
    filterValidMailAddresses(addressHashSet) {
        var mailAddresses = [];
        addressHashSet.forEach(address => {
            var validAddress = this.getValidEmailAddress(address);
            if (!StringUtils_1.StringUtils.isNullOrWhiteSpace(validAddress)) {
                mailAddresses.push(validAddress);
            }
        });
        return mailAddresses;
    }
    getValidEmailAddress(address) {
        if (!StringUtils_1.StringUtils.isNullOrWhiteSpace(address) && !this.isValidEmail(address)) {
            console.log(`Address ${address} is not a valid email address. Adding domain: ${this.defaultDomain}`);
            address = `${address}@${this.defaultDomain}`;
        }
        return address;
    }
    isValidEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email));
    }
    getMailAddressFromIdentityRef(identity) {
        if (!identity.isContainer) {
            return this.getUniqueName(identity);
        }
        console.log(`Not fetching email address for container - ${identity.displayName}`);
        return null;
    }
    getUniqueName(identity) {
        return identity.uniqueName == null ? identity.displayName : identity.uniqueName;
    }
}
exports.MailAddressViewModel = MailAddressViewModel;
//# sourceMappingURL=MailAddressViewModel.js.map