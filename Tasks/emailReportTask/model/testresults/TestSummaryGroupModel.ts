import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { TestSummaryItemModel } from "./TestSummaryItemModel";

export class TestSummaryGroupModel {

  public groupedBy: GroupTestResultsBy;

  public runs: TestSummaryItemModel[] = [];
}