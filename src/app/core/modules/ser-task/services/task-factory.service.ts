import { Injectable } from '@angular/core';
import { TaskModel } from '@core/modules/ser-task/model/task.model';
import { IModel, IDataNode } from '@core/api/model.interface';
import { ExecutionModel } from '@core/modules/ser-task/model/execution.model';
import { IdentificationModel } from '@core/modules/ser-task/model/indetification.model';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { IQlikApp } from '@apps/api/app.interface';

@Injectable()
export class TaskFactoryService {

    public selectedTasks: BehaviorSubject<ITask[]>;

    public selectTasks(tasks: ITask[]) {
    }

    /**
     * build task model
     *
     * @param {IDataNode} [data]
     * @returns {TaskModel}
     * @memberof TaskService
     */
    public buildTask(data?: ITask): TaskModel {

        const task = new TaskModel();
        const exectuion      = this.createModel(new ExecutionModel()     , data || {});
        const identification = this.createModel(new IdentificationModel(), data || {});

        task.execution = exectuion as ExecutionModel;
        task.identification = identification as IdentificationModel;

        return task;
    }

    /**
     *
     *
     * @memberof TaskService
     */
    public updateTask() {
    }

    /**
     * create default task data
     *
     * @param {string} name
     * @param {IQlikApp} app
     * @returns {ITask}
     * @memberof TaskService
     */
    public createDefaultTaskData(name: string, app: IQlikApp): ITask {

        return {
            app: {
                id: app.qDocId,
                name: app.qDocName
            },
            customProperties: [],
            enabled: true,
            isManuallyTriggerd: false,
            maxRetries: 0,
            name: name,
            tags: [],
            taskSessionTimeout: 1440,
            taskType: 0
        };
    }

    /**
     *
     *
     * @private
     * @template T
     * @param {*} model
     * @param {*} modelData
     * @returns {T}
     * @memberof ReportService
     */
    private createModel(model: IModel, modelData: IDataNode): IModel {
        const rawData = model.raw;
        const data    = modelData || {};

        Object.keys(rawData).forEach(property => {
            model[property] = data[property] === 'undefined' ? null : data[property];
        });
        return model;
    }
}
