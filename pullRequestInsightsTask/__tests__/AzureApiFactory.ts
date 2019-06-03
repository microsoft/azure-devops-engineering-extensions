import { AzureApiFactory } from "../AzureApiFactory";
import { EnvironmentConfigurations } from "../EnvironmentConfigurations";
import sinon from "sinon";
import { HostTypeError } from "../HostTypeError";

describe("AzureApiFactory Tests", () => {
    
    let azureApiFactory: AzureApiFactory;
    let configurations: EnvironmentConfigurations;

    beforeEach(() =>{
        azureApiFactory = new AzureApiFactory();
        configurations = new EnvironmentConfigurations();
        sinon.stub(configurations, "getAccessKey").returns("fakeKey");
        sinon.stub(configurations, "getTeamURI").returns("fakeURI");
    });

    test("AzureApiFactory throws error when hostType is not build or release", async () => {
        sinon.stub(configurations, "getHostType").returns("other");
        expect(azureApiFactory.create(configurations)).rejects.toThrow(HostTypeError);
    });
});