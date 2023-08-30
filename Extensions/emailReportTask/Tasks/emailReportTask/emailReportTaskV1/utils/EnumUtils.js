"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumUtils = void 0;
const SendMailCondition_1 = require("../config/report/SendMailCondition");
const GroupTestResultsBy_1 = require("../config/report/GroupTestResultsBy");
class EnumUtils {
    static GetMailConditionString(condition) {
        let index = 0;
        for (let val in SendMailCondition_1.SendMailCondition) {
            if (!isNaN(Number(val)) && condition == Number(val)) {
                break;
            }
            index++;
        }
        let index2 = 0;
        for (let val in SendMailCondition_1.SendMailCondition) {
            if (isNaN(Number(val))) {
                if (index2 == index)
                    return val;
                index2++;
            }
        }
        return null;
    }
    static GetGroupTestResultsByString(condition) {
        let index = 0;
        for (let val in GroupTestResultsBy_1.GroupTestResultsBy) {
            if (!isNaN(Number(val)) && condition == Number(val)) {
                break;
            }
            index++;
        }
        let index2 = 0;
        for (let val in GroupTestResultsBy_1.GroupTestResultsBy) {
            if (isNaN(Number(val))) {
                if (index2 == index)
                    return val;
                index2++;
            }
        }
        return null;
    }
}
exports.EnumUtils = EnumUtils;
//# sourceMappingURL=EnumUtils.js.map