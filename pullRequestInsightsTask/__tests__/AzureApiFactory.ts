import { AzureApiFactory } from "../factories/AzureApiFactory";
import sinon from "sinon";
import { HostTypeError } from "../exceptions/HostTypeError";
import { PipelineData } from "../config/PipelineData";

describe("AzureApiFactory Tests", () => {
    
    let data: PipelineData;

    beforeEach(() =>{
        data = new PipelineData();
        sinon.stub(data, "getAccessKey").returns("fakeKey");
        sinon.stub(data, "getTeamUri").returns("fakeURI");
    });

    test("AzureApiFactory throws error when hostType is not build or release", async () => {
        sinon.stub(data, "getHostType").returns("other");
        expect(AzureApiFactory.create(data)).rejects.toThrow(HostTypeError);
    });
});