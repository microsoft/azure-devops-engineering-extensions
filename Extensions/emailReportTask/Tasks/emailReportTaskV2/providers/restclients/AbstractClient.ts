import tl = require("azure-pipelines-task-lib");
import {
  WebApi,
  getPersonalAccessTokenHandler
} from "azure-devops-node-api";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";

export abstract class AbstractClient {

  protected connection: WebApi;
  protected pipelineConfig: PipelineConfiguration;

  constructor(pipelineConfig: PipelineConfiguration) {
    this.connection = this.createConnection(pipelineConfig.$teamUri, pipelineConfig.$accessKey);
    this.pipelineConfig = pipelineConfig;
  }

  /**
   * Gets Web Api to allow fetching of other Api callers, such as Git Api and Build Api
   * @param uri Default URL
   * @param accessToken token to get credentials with access to Api calls
   */
  private createConnection(uri: string, accessToken: string): WebApi {
    const creds = getPersonalAccessTokenHandler(accessToken);
    return new WebApi(uri, creds);
  }
}
