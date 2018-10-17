import { ITask } from '../../task.interface';
import { ISchemaEvent } from '../../schema-event.interface';

export interface IQrsTask {

    task: ITask;

    schemaEvents: ISchemaEvent[];
}
