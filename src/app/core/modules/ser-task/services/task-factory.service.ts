import { Injectable } from '@angular/core';
import { TaskModel } from '@core/modules/ser-task/model/task.model';
import { IModel, IDataNode } from '@core/api/model.interface';
import { ExecutionModel } from '@core/modules/ser-task/model/execution.model';
import { IdentificationModel } from '@core/modules/ser-task/model/indetification.model';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { IQlikApp } from '@apps/api/app.interface';
import { ISchemaEvent } from '../../ser-engine/api/schema-event.interface';
import { TriggerModel } from '../model/trigger.model';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { SerFilterService } from '@core/modules/ser-engine/provider/ser-filter.service';
import { TaskIncomatibleException } from '../api/exceptions/incompatible.exception';

@Injectable()
export class TaskFactoryService {

    public selectedTasks: BehaviorSubject<ITask[]>;

    private http: HttpClient;

    private filterService: SerFilterService;

    public constructor(
        http: HttpClient,
        filterService: SerFilterService
    ) {
        this.http = http;
        this.filterService = filterService;
    }

    /**
     * build task model
     *
     * @param {IDataNode} [data]
     * @returns {TaskModel}
     * @memberof TaskService
     */
    public buildTask(data?: ITask): Observable<TaskModel> {

        return of(new TaskModel())
            .pipe(
                mergeMap((task: TaskModel): Observable<TaskModel> => {

                    return forkJoin([
                        this.createModel(new ExecutionModel(), data || {}),
                        this.createIdentificationModel(data),
                        this.createTriggerModel(data ? data.id : null),
                    ])
                    .pipe(
                        map((models) => {
                            const [exectuion, identification, trigger] = models;
                            task.id             = data ? data.id : null;
                            task.execution      = exectuion as ExecutionModel;
                            task.identification = identification as IdentificationModel;
                            task.trigger        = trigger as TriggerModel;

                            return task;
                        })
                    );
                })
            );
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
            isManuallyTriggered: false,
            maxRetries: 0,
            name: name,
            tags: [],
            taskSessionTimeout: 1440,
            taskType: 0
        };
    }

    public createSchemaEvent(startTime: number, task?: ITask): ISchemaEvent {

        const start = new Date();
        const end   = new Date('31 December 9999 00:00 UTC');

        if (startTime) {
            start.setHours(startTime || 2);
            start.setMinutes(0);
            start.setSeconds(0);
            start.setMilliseconds(0);
        }

        const eventData: ISchemaEvent = {
            enabled: true,
            expirationDate: end.toISOString(),
            startDate: start.toISOString(),
            eventType: 0,
            name: 'ser daily schema',
            incrementDescription: '0 0 1 0', // day
            incrementOption: '1', // amount of days
            privileges: ['read', 'update', 'create', 'delete'],
            schemaFilterDescription: ['* * - * * * * *'],
            timeZone: 'Europe/Paris'
        };

        if (task ) {
            eventData.reloadTask = {
                id: task.id,
                name: task.name
            };
        }

        return eventData;
    }

    /**
     * create trigger model
     *
     * @param {*} data
     * @returns {TriggerModel}
     * @memberof TaskFactoryService
     */
    public createTriggerModel(taskId: string): Observable<TriggerModel> {
        const model = new TriggerModel();

        if (taskId) {
            const filter = this.filterService.createFilter('reloadTask.id', taskId);
            return this.http.get('/qrs/event/full', {
                params: {
                    filter: this.filterService.createFilterQueryString(filter)
                }
            }).pipe(
                map((events: any[]) => {

                    // validate event
                    let isValid = true;
                    isValid = isValid && events.length === 1;
                    isValid = isValid && events[0].incrementDescription === '0 0 1 0';
                    isValid = isValid && events[0].incrementOption === 1;
                    isValid = isValid && events[0].timeZone === 'Europe/Paris';
                    isValid = isValid && events[0].eventType === 0;

                    console.dir(events);

                    if (!isValid) {
                        throw new TaskIncomatibleException('task incompatible');
                    }

                    const startDate = new Date(events[0].startDate);
                    const timezoneOffset = startDate.getTimezoneOffset() / 60;
                    model.hour = startDate.getHours() - timezoneOffset;
                    return model;
                })
            );
        }

        return of(model);
    }

    /**
     * create trigger model
     *
     * @param {*} data
     * @returns {TriggerModel}
     * @memberof TaskFactoryService
     */
    public createIdentificationModel(data: ITask): Observable<IdentificationModel> {
        const model = new IdentificationModel();
        model.app   = data && data.app ? data.app.id : null;
        model.name  = data ? data.name : null;
        return of(model);
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
    private createModel(model: IModel, modelData: IDataNode): Observable<IModel> {
        const rawData = model.raw;
        const data    = modelData || {};

        Object.keys(rawData).forEach(property => {
            model[property] = data[property] === 'undefined' ? null : data[property];
        });
        return of(model);
    }
}
