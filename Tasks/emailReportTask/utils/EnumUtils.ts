import { SendMailCondition } from "../config/report/SendMailCondition";
import { GroupTestResultsBy } from "../config/report/GroupTestResultsBy";

export class EnumUtils {
  
  public static GetMailConditionString(condition: SendMailCondition): string {
    let index = 0;
    for(let val in SendMailCondition) {
      if(!isNaN(Number(val)) && condition == Number(val)) {
        break;
      }
      index++;
    }

    let index2 = 0;
    for(let val in SendMailCondition) {
      if(isNaN(Number(val))) {
        if(index2 == index) return val;
        index2++;
      }
    }

    return null;
  }
}