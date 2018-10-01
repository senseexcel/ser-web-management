import { IModel, IDataNode } from '@core/api/model.interface';
import { ExecutionModel } from './execution.model';
import { IdentificationModel } from './indetification.model';

/**
 * task model
 *
 * @export
 * @class TaskModel
 */
export class TaskModel implements IModel {

    /**
     * task execution data
     *
     * @type {ExecutionModel}
     * @memberof TaskModel
     */
    public taskExecution: ExecutionModel;

    /**
     * task identification
     *
     * @type {IdentificationModel}
     * @memberof TaskModel
     */
    public taskIdentification: IdentificationModel;

    /**
     * get task execution model
     *
     * @type {ExecutionModel}
     * @memberof TaskModel
     */
    public get execution(): ExecutionModel {
        return this.taskExecution;
    }

    /**
     * get task identification model
     *
     * @type {IdentificationModel}
     * @memberof TaskModel
     */
    public get identification(): IdentificationModel {
        return this.taskIdentification;
    }

    /**
     * set task execution model
     *
     * @memberof TaskModel
     */
    public set execution(excetution: ExecutionModel) {
        this.taskExecution = excetution;
    }

    /**
     * set task identification model
     *
     * @memberof TaskModel
     */
    public set identification(identification: IdentificationModel) {
        this.taskIdentification = identification;
    }

    /**
     * get raw data for task model
     *
     * @readonly
     * @memberof TaskModel
     */
    public get raw(): IDataNode {

        return {
            execution: this.execution.raw,
            identification: this.identification.raw
        };
    }
}
