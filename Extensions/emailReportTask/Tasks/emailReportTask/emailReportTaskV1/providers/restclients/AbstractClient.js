"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractClient = void 0;
const azure_devops_node_api_1 = require("azure-devops-node-api");
class AbstractClient {
    constructor(pipelineConfig) {
        this.connection = this.createConnection(pipelineConfig.$teamUri, pipelineConfig.$accessKey);
        this.pipelineConfig = pipelineConfig;
    }
    /**
     * Gets Web Api to allow fetching of other Api callers, such as Git Api and Build Api
     * @param uri Default URL
     * @param accessToken token to get credentials with access to Api calls
     */
    createConnection(uri, accessToken) {
        const creds = azure_devops_node_api_1.getPersonalAccessTokenHandler(accessToken);
        return new azure_devops_node_api_1.WebApi(uri, creds);
    }
}
exports.AbstractClient = AbstractClient;
//# sourceMappingURL=AbstractClient.js.map