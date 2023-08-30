import { TestOutcomeForPriority } from "../testresults/TestOutcomeForPriority";
export declare class TestInfoByPriorityViewModelWrapper {
    TestInfoByPriorityViewModel: TestInfoByPriorityViewModel[];
}
export declare class TestInfoByPriorityViewModel {
    Priority: number;
    PassingRate: string;
    TestCount: number;
    constructor(priority: number, testCountByOutcome: Map<TestOutcomeForPriority, number>, includeOthersInTotal: boolean);
    private getPassingTestCountByOutcome;
}
