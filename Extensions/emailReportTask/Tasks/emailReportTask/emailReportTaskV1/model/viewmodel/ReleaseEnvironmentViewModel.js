"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseEnvironmentViewModel = void 0;
class ReleaseEnvironmentViewModel {
    constructor(environment) {
        this.EnvironmentName = environment == null ? null : environment.name;
        this.EnvironmentOwnerEmail = environment != null && environment.owner != null ? environment.owner.uniqueName : null;
    }
}
exports.ReleaseEnvironmentViewModel = ReleaseEnvironmentViewModel;
//# sourceMappingURL=ReleaseEnvironmentViewModel.js.map