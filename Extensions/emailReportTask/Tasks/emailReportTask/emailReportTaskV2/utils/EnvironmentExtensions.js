"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentExtensions = void 0;
class EnvironmentExtensions {
    static getPhases(environment) {
        const phases = new Array();
        if (environment.deploySteps != null && environment.deploySteps.length > 0) {
            let attempt = 0;
            let latestDeploySteps = environment.deploySteps[0];
            for (var i = 0; i < environment.deploySteps.length; i++) {
                if (environment.deploySteps[i].attempt > attempt) {
                    latestDeploySteps = environment.deploySteps[i];
                }
            }
            phases.push(...latestDeploySteps.releaseDeployPhases);
        }
        return phases;
    }
}
exports.EnvironmentExtensions = EnvironmentExtensions;
//# sourceMappingURL=EnvironmentExtensions.js.map