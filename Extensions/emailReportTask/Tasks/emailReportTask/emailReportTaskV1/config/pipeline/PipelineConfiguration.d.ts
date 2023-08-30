import { PipelineType } from "./PipelineType";
export declare class PipelineConfiguration {
    private pipelineType;
    private pipelineId;
    private projectId;
    private projectName;
    private environmentId;
    private environmentDefinitionId;
    private usePreviousEnvironment;
    private teamUri;
    private accessKey;
    private testTabLink;
    constructor($pipelineType: PipelineType, $pipelineId: number, $projectId: string, $projectName: string, $environmentId: number, $environmentDefinitionId: number, $usePreviousEnvironment: boolean, $teamUri: string, $accessKey: string);
    /**
   * Getter $pipelineId
   * @return {number}
   */
    get $pipelineType(): number;
    /**
     * Getter $pipelineId
     * @return {number}
     */
    get $pipelineId(): number;
    /**
     * Getter $projectId
     * @return {string}
     */
    get $projectId(): string;
    /**
     * Getter $projectName
     * @return {string}
     */
    get $projectName(): string;
    /**
     * Getter $environmentId
     * @return {number}
     */
    get $environmentId(): number;
    /**
     * Getter $environmentDefinitionId
     * @return {number}
     */
    get $environmentDefinitionId(): number;
    /**
  * Getter $usePreviousEnvironment
  * @return {boolean}
  */
    get $usePreviousEnvironment(): boolean;
    /**
     * Getter $teamUri
     * @return {string}
     */
    get $teamUri(): string;
    /**
     * Getter $accessKey
     * @return {string}
     */
    get $accessKey(): string;
    getTestTabLink(): string;
}
