import tl = require("azure-pipelines-task-lib/task");
import { AbstractAzureApi } from "../dataProviders/AbstractAzureApi";
import { BuildAzureApi } from "../dataProviders/BuildAzureApi";
import { HostTypeError } from "../exceptions/HostTypeError";
import { PipelineData } from "../config/PipelineData";
import { ReleaseAzureApi } from "../dataProviders/ReleaseAzureApi";

export class AzureApiFactory {
  public static readonly BUILD: string = "build";
  public static readonly RELEASE: string = "release";

  public static async create(data: PipelineData): Promise<AbstractAzureApi> {
    let type: string = data.getHostType();
    tl.debug("host type: " + type);
    if (type.toLowerCase() === AzureApiFactory.BUILD) {
      return new BuildAzureApi(data.getTeamUri(), data.getAccessKey());
    }
    if (type.toLowerCase() === AzureApiFactory.RELEASE) {
      return new ReleaseAzureApi(data.getTeamUri(), data.getAccessKey());
    }
    throw new HostTypeError(`ERROR: CANNOT RUN TASK FOR HOST TYPE ${type}`);
  }
}
