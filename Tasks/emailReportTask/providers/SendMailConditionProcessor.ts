import { IPostProcessor } from "./IPostProcessor";
import { Report } from "../model/Report";
import { ReportConfiguration } from "../config/ReportConfiguration";
import { SendMailCondition } from "../config/report/SendMailCondition";

export class SendMailConditionProcessor implements IPostProcessor {
  async processReportAsync(reportConfig: ReportConfiguration, report: Report): Promise<void> {
    var shouldSendMail = false;
    if(!report.$dataMissing) {
      const sendMailCondition = reportConfig.$sendMailCondition;

      shouldSendMail = sendMailCondition == SendMailCondition.Always;
      if (!shouldSendMail)
      {
          var hasTestFailures = report.hasFailedTests(reportConfig.$reportDataConfiguration.$includeOthersInTotal);
          var hasFailedTasks = report.hasFailedTasks();
          var hasCanceledPhases = report.hasCanceledPhases();
          var hasFailure = hasTestFailures || hasFailedTasks || hasCanceledPhases;

          if ((sendMailCondition == SendMailCondition.OnFailure && hasFailure)
              || (sendMailCondition == SendMailCondition.OnSuccess && !hasFailure))
          {
              shouldSendMail = true;
          }
          else if (sendMailCondition == SendMailCondition.OnNewFailuresOnly && hasFailure)
          {
              // TODO - Compare prev run and curr run for same failures
              // // Always treat phase cancellation issues as new failure as we cannot distinguish/compare phase level issues
              // // Still compare failed tests and failed tasks where possible to reduce noise
              // if (hasCanceledPhases && !hasTestFailures && !hasFailedTasks)
              // {
              //     shouldSendMail = true;
              //     console.log(`Has Phase cancellation(s) issues. Treating as new failure.`);
              // }
              // else
              // {
              //     // console.log(`Looking for new failures, as the user send mail condition is '${sendMailCondition}'.`);
              //     // shouldSendMail = !HasPreviousReleaseGotSameFailures(report, config, hasTestFailures, hasFailedTasks);
              // }
          }
      }
    }

    report.$sendMailConditionSatisfied = shouldSendMail;
  }
}