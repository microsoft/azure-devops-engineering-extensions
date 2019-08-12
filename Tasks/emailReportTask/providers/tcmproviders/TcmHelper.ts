import { TestOutcome, TestCaseResult, CustomTestField } from "azure-devops-node-api/interfaces/TestInterfaces";

export class TcmHelper {

  public static readonly OutcomeConfidenceValue: Number = 0.0;

  public static exceptOutcomes(outcomesToExclude: TestOutcome[]) : TestOutcome[] {
    const otherOutComes : TestOutcome[] = [];
    for(let outcome in TestOutcome) {
      var outcomeNum = Number(outcome);
      if(!isNaN(outcomeNum) && !outcomesToExclude.includes(outcomeNum)) {
        otherOutComes.push(outcomeNum);
      }
    }

    return otherOutComes;
  }

  public static parseOutcome(outcomeString: string) : TestOutcome {
    let result: TestOutcome;
    switch(outcomeString)
    {
      case "Passed" : result = TestOutcome.Passed; break;
      case "Failed" : result = TestOutcome.Failed; break;
      case "Inconclusive" : result = TestOutcome.Inconclusive; break;
      case "NotExecuted" : result = TestOutcome.NotExecuted; break;
      default: result = TestOutcome.None; break;
    }
    return result;
  }

  public static isTestFlaky(result: TestCaseResult): boolean
  {
      var outcomeConfidenceField = TcmHelper.getCustomField(result, "OutcomeConfidence");
      if (outcomeConfidenceField != null 
          && outcomeConfidenceField.value != null) {
          const outcomeFieldValue = Number.parseFloat(outcomeConfidenceField.value);
          if(!isNaN(outcomeFieldValue)) {      
            return outcomeFieldValue == TcmHelper.OutcomeConfidenceValue;
          }
      }

      return false;            
  }

  public static getCustomField(result: TestCaseResult, fieldName: string): CustomTestField
  {
      if (result.customFields == null)
      {
          return null;
      }

      var cf = result.customFields.filter(c => c.fieldName.toLowerCase() == fieldName.toLowerCase());
      return cf.length > 0 ? cf[0] : null;            
  }

  public static Merge<T>(source: Array<Array<T>>): T[] {
      const mergedResults: T[] = [];

      source.forEach(item => {
        if (item != null)
        {
            mergedResults.push(...item);
        }
      });

      return mergedResults;
  }
  
}