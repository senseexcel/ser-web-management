import { Injectable } from '@angular/core';
import { TaskModel } from '@core/modules/ser-task/model/task.model';
import { IModel, IDataNode } from '@core/api/model.interface';
import { ExecutionModel } from '@core/modules/ser-task/model/execution.model';
import { IdentificationModel } from '@core/modules/ser-task/model/indetification.model';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '@core/modules/ser-engine/api/task.interface';

@Injectable()
export class TaskService {

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
