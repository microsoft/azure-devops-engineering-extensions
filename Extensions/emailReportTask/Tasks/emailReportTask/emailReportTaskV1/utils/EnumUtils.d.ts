import { SendMailCondition } from "../config/report/SendMailCondition";
import { GroupTestResultsBy } from "../config/report/GroupTestResultsBy";
export declare class EnumUtils {
    static GetMailConditionString(condition: SendMailCondition): string;
    static GetGroupTestResultsByString(condition: GroupTestResultsBy): string;
}
