import { JobModel } from "./JobModel";

export class PhaseModel {

  private name: string;
  private jobs: JobModel[];
  private status: string;
  private rank: number;  

	constructor($name: string, $jobs: JobModel[], $status: string, $rank: number) {
		this.name = $name;
		this.jobs = $jobs;
		this.status = $status;
		this.rank = $rank;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $jobs
     * @return {JobModel[]}
     */
	public get $jobs(): JobModel[] {
		return this.jobs;
	}

    /**
     * Getter $status
     * @return {string}
     */
	public get $status(): string {
		return this.status;
	}

    /**
     * Getter $rank
     * @return {number}
     */
	public get $rank(): number {
		return this.rank;
	}
}