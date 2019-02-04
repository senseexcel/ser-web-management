import { ITask } from './task.interface';
import { ISchemaEvent } from './schema-event.interface';

export interface ITaskDefinition {

    task: ITask;

    schemaEvents?: ISchemaEvent[];
}
