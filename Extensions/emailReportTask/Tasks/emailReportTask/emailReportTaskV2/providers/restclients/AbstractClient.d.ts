import { WebApi } from "azure-devops-node-api";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
export declare abstract class AbstractClient {
    protected connection: WebApi;
    protected pipelineConfig: PipelineConfiguration;
    constructor(pipelineConfig: PipelineConfiguration);
    /**
     * Gets Web Api to allow fetching of other Api callers, such as Git Api and Build Api
     * @param uri Default URL
     * @param accessToken token to get credentials with access to Api calls
     */
    private createConnection;
}
