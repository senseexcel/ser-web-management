import { IQrsApp } from '@core/modules/ser-engine/api/response/qrs/app.interface';
import { TaskModel } from './task.model';

export class TaskFormModel {

    private taskApps: IQrsApp[];

    private taskIsNew: boolean;

    private taskData: TaskModel;

    /**
     * get available apps task can be added
     *
     * @type {IQrsApp[]}
     * @memberof TaskFormModel
     */
    public get apps(): IQrsApp[] {
        return this.taskApps;
    }

    /**
     * set available apps task can be added
     *
     * @memberof TaskFormModel
     */
    public set apps(apps: IQrsApp[]) {
        this.taskApps = apps;
    }

    /**
     *
     * @type {boolean}
     * @memberof TaskFormModel
     */
    public get isNew(): boolean {
        return !!this.taskIsNew;
    }

    /**
     *
     * @memberof TaskFormModel
     */
    public set isNew(isNew: boolean) {
        this.taskIsNew = isNew;
    }

    public get task(): TaskModel {
        return this.taskData;
    }

    public set task(data: TaskModel) {
        this.taskData = data;
    }
}
