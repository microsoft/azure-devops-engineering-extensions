import { ReleaseEnvironment } from "azure-devops-node-api/interfaces/ReleaseInterfaces";

export class ReleaseEnvironmentViewModel {
    public EnvironmentName: string;
    public EnvironmentOwnerEmail: string;

    constructor(environment: ReleaseEnvironment)
    {
        this.EnvironmentName = environment == null ? null : environment.name;
        this.EnvironmentOwnerEmail = environment != null && environment.owner != null ? environment.owner.uniqueName : null;
    }
}
