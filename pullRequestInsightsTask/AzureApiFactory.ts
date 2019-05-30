import tl = require('azure-pipelines-task-lib/task');
import { EnvironmentConfigurations } from './EnvironmentConfigurations';
import { AbstractAzureApi } from './AbstractAzureApi'
import { BuildAzureApi } from './BuildAzureApi'
import { ReleaseAzureApi } from './ReleaseAzureApi'


export class AzureApiFactory{
    private static readonly BUILD = "build";
    private static readonly RELEASE = "release";
    public async create(configurations: EnvironmentConfigurations): Promise<AbstractAzureApi>{
     let type: string = configurations.getHostType();
     tl.debug("host type: " + type);
        if (type === AzureApiFactory.BUILD){
            return new BuildAzureApi(configurations.getTeamURI(), configurations.getAccessKey()); 
        }
        if (type === AzureApiFactory.RELEASE){
            return new ReleaseAzureApi(configurations.getTeamURI(), configurations.getAccessKey()); 
       }
       throw(new Error(`ERROR: CANNOT RUN FOR HOST TYPE ${type}`));
    }
}
