import tl = require('azure-pipelines-task-lib/task');
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
import { AbstractAzureApi } from './AbstractAzureApi'
import { BuildAzureApi } from './BuildAzureApi'
import { ReleaseAzureApi } from './ReleaseAzureApi'
import { HostTypeError } from './HostTypeError';

export class AzureApiFactory{
    private static readonly BUILD = "build";
    private static readonly RELEASE = "release";

    // private static readonly apiSourceByHostType: { [id: string]: any}  = [
    //     { "build": (configurations: EnvironmentConfigurations) => new BuildAzureApi(configurations.getTeamURI(), configurations.getAccessKey()) },
    //     { "release": (configurations: EnvironmentConfigurations) => new ReleaseAzureApi(configurations.getTeamURI(), configurations.getAccessKey()) }
    // ];

    public async create(configurations: EnvironmentConfigurations): Promise<AbstractAzureApi>{
      //  AzureApiFactory.apiSourceByHostType[configurations.getHostType()](configurations)
     let type: string = configurations.getHostType();
     tl.debug("host type: " + type);
        if (type.toLowerCase() === AzureApiFactory.BUILD){
            return new BuildAzureApi(configurations.getTeamURI(), configurations.getAccessKey()); 
        }
        if (type.toLowerCase() === AzureApiFactory.RELEASE){
            return new ReleaseAzureApi(configurations.getTeamURI(), configurations.getAccessKey()); 
       }
       throw(new HostTypeError(`ERROR: CANNOT RUN TASK FOR HOST TYPE ${type}`));
    }
}
