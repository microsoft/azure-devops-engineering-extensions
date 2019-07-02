import tl = require('azure-pipelines-task-lib/task');
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
import { AbstractAzureApi } from './AbstractAzureApi'
import { BuildAzureApi } from './BuildAzureApi'
import { ReleaseAzureApi } from './ReleaseAzureApi'
import { HostTypeError } from './HostTypeError';
import { PipelineData } from './PipelineData';

export class AzureApiFactory{
    private static readonly BUILD = "build";
    private static readonly RELEASE = "release";

    public async create(data: PipelineData): Promise<AbstractAzureApi>{
     let type: string = data.getHostType();
     tl.debug("host type: " + type);
        if (type.toLowerCase() === AzureApiFactory.BUILD){
            return new BuildAzureApi(data.getTeamUri(), data.getAccessKey()); 
        }
        if (type.toLowerCase() === AzureApiFactory.RELEASE){
            return new ReleaseAzureApi(data.getTeamUri(), data.getAccessKey()); 
       }
       throw(new HostTypeError(`ERROR: CANNOT RUN TASK FOR HOST TYPE ${type}`));
    }
}
