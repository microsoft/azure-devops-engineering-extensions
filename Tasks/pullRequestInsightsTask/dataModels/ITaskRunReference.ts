/**
 * Interface representing a reference to a single task run, regardless of pipeline type
 */
export interface ITaskRunReference {
  name?: string;
  id?: string;
  version?: string;
}
