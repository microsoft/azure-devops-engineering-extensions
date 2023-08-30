"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcmHelper = void 0;
const TestInterfaces_1 = require("azure-devops-node-api/interfaces/TestInterfaces");
class TcmHelper {
    static exceptOutcomes(outcomesToExclude) {
        const otherOutComes = [];
        for (let outcome in TestInterfaces_1.TestOutcome) {
            var outcomeNum = Number(outcome);
            if (!isNaN(outcomeNum) && !outcomesToExclude.includes(outcomeNum)) {
                otherOutComes.push(outcomeNum);
            }
        }
        return otherOutComes;
    }
    static parseOutcome(outcomeString) {
        let result;
        switch (outcomeString) {
            case "Passed":
                result = TestInterfaces_1.TestOutcome.Passed;
                break;
            case "Failed":
                result = TestInterfaces_1.TestOutcome.Failed;
                break;
            case "Inconclusive":
                result = TestInterfaces_1.TestOutcome.Inconclusive;
                break;
            case "NotExecuted":
                result = TestInterfaces_1.TestOutcome.NotExecuted;
                break;
            default:
                result = TestInterfaces_1.TestOutcome.None;
                break;
        }
        return result;
    }
    static isTestFlaky(result) {
        var outcomeConfidenceField = TcmHelper.getCustomField(result, "OutcomeConfidence");
        if (outcomeConfidenceField != null
            && outcomeConfidenceField.value != null) {
            const outcomeFieldValue = Number.parseFloat(outcomeConfidenceField.value);
            if (!isNaN(outcomeFieldValue)) {
                return outcomeFieldValue == TcmHelper.OutcomeConfidenceValue;
            }
        }
        return false;
    }
    static getCustomField(result, fieldName) {
        if (result.customFields == null) {
            return null;
        }
        var cf = result.customFields.filter(c => c.fieldName.toLowerCase() == fieldName.toLowerCase());
        return cf.length > 0 ? cf[0] : null;
    }
    static Merge(source) {
        const mergedResults = [];
        source.forEach(item => {
            if (item != null) {
                mergedResults.push(...item);
            }
        });
        return mergedResults;
    }
}
exports.TcmHelper = TcmHelper;
TcmHelper.OutcomeConfidenceValue = 0.0;
//# sourceMappingURL=TcmHelper.js.map