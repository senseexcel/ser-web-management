import { TaskModel } from './task.model';
import { IApp } from '@smc/modules/qrs';

export class TaskFormModel {

    private taskApps: IApp[];

    private taskIsNew: boolean;

    private taskData: TaskModel;

    /**
     * get available apps task can be added
     *
     * @type {IQrsApp[]}
     * @memberof TaskFormModel
     */
    public get apps(): IApp[] {
        return this.taskApps;
    }

    /**
     * set available apps task can be added
     *
     * @memberof TaskFormModel
     */
    public set apps(apps: IApp[]) {
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
