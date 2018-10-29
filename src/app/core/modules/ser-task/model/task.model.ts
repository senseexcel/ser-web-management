import { IModel, IDataNode } from '@core/api/model.interface';
import { ExecutionModel } from './execution.model';
import { IdentificationModel } from './indetification.model';
import { IQrsApp } from '@core/modules/ser-engine/api/response/qrs/app.interface';
import { TriggerModel } from './trigger.model';

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
    private taskExecution: ExecutionModel;

    /**
     * task identification
     *
     * @type {IdentificationModel}
     * @memberof TaskModel
     */
    private taskIdentification: IdentificationModel;

    /**
     *
     *
     * @private
     * @type {IQrsApp}
     * @memberof TaskModel
     */
    private taskApp: IQrsApp;

    /**
     * id of the task
     *
     * @private
     * @type {string}
     * @memberof TaskModel
     */
    private taskId: string;

    private taskTrigger: TriggerModel;

    /**
     *
     *
     * @type {IQrsApp}
     * @memberof TaskModel
     */
    public get app(): IQrsApp {
        return this.taskApp;
    }

    /**
     *
     *
     * @memberof TaskModel
     */
    public set app(app: IQrsApp) {
        this.taskApp = app;
    }

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

    public set trigger(trigger: TriggerModel) {
        this.taskTrigger = trigger;
    }

    public get trigger(): TriggerModel {
        return this.taskTrigger;
    }

    /**
     * set id of task
     *
     * @memberof TaskModel
     */
    public set id(id: string) {
        this.taskId = id;
    }

    /**
     * get id from task
     *
     * @type {string}
     * @memberof TaskModel
     */
    public get id(): string {
        return this.taskId;
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
