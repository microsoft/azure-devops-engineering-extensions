import { Build } from "./build";
import tl = require('azure-pipelines-task-lib/task');

export class Branch{

    private builds: Build[]; 
    private name: string;

    constructor(name: string, builds: Build[]){
    this.builds = builds;
    this.name = name;
    }

    public getBuildFailStreak(): number{
        let count: number = 0;
        for (let numberBuild = 0; numberBuild < this.builds.length; numberBuild++){
            if (this.builds[numberBuild].failed()){
                count++;
            }
            else {
                break;
            }
        }
        tl.debug(`number builds failing on ${this.name} is ${count}`)
        return count;
    }

    public getMostRecentFailedBuild(): Build | null{
        for (let build of this.builds){
            tl.debug(build.getId() + " : " + String(build.failed()));
            if (build.failed()){
                tl.debug("failure: " + build.getId());
                return build; 
            }
        }
        return null;
    }

    public getName(): string{
        return this.name;
    }

}
