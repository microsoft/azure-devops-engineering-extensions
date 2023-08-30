import { ChangeModel } from "../ChangeModel";
import { PipelineConfiguration } from "../../config/pipeline/PipelineConfiguration";
export declare class ChangeViewModelWrapper {
    ChangeViewModel: ChangeViewModel[];
}
export declare class ChangeViewModel {
    readonly ConstHashLength = 8;
    AuthorName: string;
    Id: string;
    Message: string;
    TimeStamp: string;
    Url: string;
    ShortId: string;
    constructor(change: ChangeModel, config: PipelineConfiguration);
}
