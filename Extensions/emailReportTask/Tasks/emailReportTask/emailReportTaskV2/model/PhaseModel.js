"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseModel = void 0;
class PhaseModel {
    constructor($name, $jobs, $status, $rank) {
        this.name = $name;
        this.jobs = $jobs;
        this.status = $status;
        this.rank = $rank;
    }
    /**
     * Getter $name
     * @return {string}
     */
    get $name() {
        return this.name;
    }
    /**
     * Getter $jobs
     * @return {JobModel[]}
     */
    get $jobs() {
        return this.jobs;
    }
    /**
     * Getter $status
     * @return {string}
     */
    get $status() {
        return this.status;
    }
    /**
     * Getter $rank
     * @return {number}
     */
    get $rank() {
        return this.rank;
    }
}
exports.PhaseModel = PhaseModel;
//# sourceMappingURL=PhaseModel.js.map