import { GroupTestResultsBy } from "../../config/report/GroupTestResultsBy";
import { TestSummaryItemModel } from "./TestSummaryItemModel";
export declare class TestSummaryGroupModel {
    groupedBy: GroupTestResultsBy;
    runs: TestSummaryItemModel[];
}
