import { ReleaseReport } from "./ReleaseReport";
import { PipelineConfiguration } from "../config/pipeline/PipelineConfiguration";
import { PipelineType } from "../config/pipeline/PipelineType";
import { Report } from "./Report";
import { Release, ReleaseEnvironment } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { ChangeModel } from "./ChangeModel";
import { PhaseModel } from "./PhaseModel";

export class ReportFactory {

  static createNewReport(pipelineConfig: PipelineConfiguration) {
    return (pipelineConfig.$pipelineType == PipelineType.Build) ? null : new ReleaseReport();
  }

  static mergeReports(reports: Report[]) : Report {
    if(reports == null || reports.length == 0) return null;
    if(reports.length == 1) return reports[0];

    let finalReport = reports[0];
    for(var i = 1; i < reports.length; i++) {
      finalReport = ReportFactory.mergeTwoReports(finalReport, reports[i]);
    }

    return finalReport;
  }

  private static mergeTwoReports(source: Report, target: Report) : Report {
    let associatedChanges: ChangeModel[] = [];
    let phases: PhaseModel[] = [];
    if (target.$testSummaryGroups != null)
    {
      source.$testSummaryGroups.push(...target.$testSummaryGroups);
    }

    if (target.$associatedChanges != null)
    {
      associatedChanges = target.$associatedChanges;
    }

    if (target.$failedTestOwners != null)
    {
        source.$failedTestOwners.push(...target.$failedTestOwners);
    }

    if (target.filteredResults != null)
    {
        source.filteredResults = target.filteredResults;
    }

    if (target.hasFilteredTests)
    {
        source.hasFilteredTests = target.hasFilteredTests;
    }

    if (target.testResultSummary != null)
    {
        source.testResultSummary = target.testResultSummary;
    }

    if (target.$phases != null)
    {
      phases = target.$phases;
    }

    if(source instanceof ReleaseReport) {
      var releaseTarget = target as ReleaseReport;  
      var releaseSource = source as ReleaseReport;

      let targetRelease: Release = null;
      let targetEnv: ReleaseEnvironment = null;
      let targetLastRelease: Release = null;
      let targetLastEnv: ReleaseEnvironment = null;

      if (releaseTarget.$release != null)
      {
        targetRelease = releaseTarget.$release;
      }

      if (releaseTarget.$environment != null)
      {
        targetEnv = releaseTarget.$environment;
      }

      if (releaseTarget.$lastCompletedEnvironment != null)
      {
        targetLastRelease = releaseTarget.$lastCompletedRelease;
      }

      if (releaseTarget.$lastCompletedEnvironment != null)
      {
        targetLastEnv = releaseTarget.$lastCompletedEnvironment;
      }

      if(targetRelease != null) {
        releaseSource.setReleaseData(targetRelease, targetEnv, targetLastRelease, phases, associatedChanges, targetLastEnv);
      }
    }

    return source;
  }
}