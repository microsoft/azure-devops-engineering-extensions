import { PipelineType } from "./PipelineType";
import { LinkHelper } from "../../model/helpers/LinkHelper";

export class PipelineConfiguration {
  private pipelineType: PipelineType;
  private pipelineId: number;
  private projectId: string;
  private projectName: string;
  private environmentId: number;
  private environmentDefinitionId: number;
  private usePreviousEnvironment: boolean;
  private teamUri: string;
  private accessKey: string;
  private testTabLink: string;

  constructor($pipelineType: PipelineType,
    $pipelineId: number,
    $projectId: string,
    $projectName: string,
    $environmentId: number,
    $environmentDefinitionId: number,
    $usePreviousEnvironment: boolean,
    $teamUri: string,
    $accessKey: string) {
    this.pipelineType = $pipelineType;
    this.pipelineId = $pipelineId;
    this.projectId = $projectId;
    this.projectName = $projectName;
    this.environmentId = $environmentId;
    this.environmentDefinitionId = $environmentDefinitionId;
    this.usePreviousEnvironment = $usePreviousEnvironment;
    this.teamUri = $teamUri;
    this.accessKey = $accessKey;
  }

  /**
 * Getter $pipelineId
 * @return {number}
 */
  public get $pipelineType(): number {
    return this.pipelineType;
  }

  /**
   * Getter $pipelineId
   * @return {number}
   */
  public get $pipelineId(): number {
    return this.pipelineId;
  }

  /**
   * Getter $projectId
   * @return {string}
   */
  public get $projectId(): string {
    return this.projectId;
  }

  /**
   * Getter $projectName
   * @return {string}
   */
  public get $projectName(): string {
    return this.projectName;
  }

  /**
   * Getter $environmentId
   * @return {number}
   */
  public get $environmentId(): number {
    return this.environmentId;
  }

  /**
   * Getter $environmentDefinitionId
   * @return {number}
   */
  public get $environmentDefinitionId(): number {
    return this.environmentDefinitionId;
  }

  /**
* Getter $usePreviousEnvironment
* @return {boolean}
*/
  public get $usePreviousEnvironment(): boolean {
    return this.usePreviousEnvironment;
  }

  /**
   * Getter $teamUri
   * @return {string}
   */
  public get $teamUri(): string {
    return this.teamUri;
  }

  /**
   * Getter $accessKey
   * @return {string}
   */
  public get $accessKey(): string {
    return this.accessKey;
  }

  public getTestTabLink(): string {
    if (this.testTabLink == null) {
      if (this.pipelineType == PipelineType.Release) {
        this.testTabLink = LinkHelper.getTestTabLinkInRelease(this);
      } else if (this.pipelineType == PipelineType.Build) {
        this.testTabLink = LinkHelper.getTestTabLinkInBuild(this);
      }
    } 
    return this.testTabLink;
  }
}
