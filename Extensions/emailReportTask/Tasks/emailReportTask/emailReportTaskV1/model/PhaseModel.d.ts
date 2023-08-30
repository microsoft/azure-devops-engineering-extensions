import { JobModel } from "./JobModel";
export declare class PhaseModel {
    private name;
    private jobs;
    private status;
    private rank;
    constructor($name: string, $jobs: JobModel[], $status: string, $rank: number);
    /**
     * Getter $name
     * @return {string}
     */
    get $name(): string;
    /**
     * Getter $jobs
     * @return {JobModel[]}
     */
    get $jobs(): JobModel[];
    /**
     * Getter $status
     * @return {string}
     */
    get $status(): string;
    /**
     * Getter $rank
     * @return {number}
     */
    get $rank(): number;
}
