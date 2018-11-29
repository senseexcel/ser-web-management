import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ProcessService } from '../../services';
import { takeUntil, map } from 'rxjs/operators';
import { IProcess } from '../../api';

@Component({
    selector: 'app-monitoring-process-list',
    styleUrls: ['./process-list.component.scss'],
    templateUrl: 'process-list.component.html'
})

export class ProcessListComponent implements OnDestroy, OnInit {

    /**
     * table header fields
     *
     * @memberof UserComponent
     */
    public tableHeaderFields = ['processId', 'user', 'appName', 'stop'];

    /**
     * process list
     *
     * @private
     * @type {IProcess[]}
     * @memberof ProcessListComponent
     */
    public processes: IProcess[];

    /**
     * true if all data has been loaded
     *
     * @type {boolean}
     * @memberof ProcessListComponent
     */
    public ready: boolean;

    /**
     * emits true if component gets destroyed
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof TasksComponent
     */
    private isDestroyed$: Subject<boolean>;

    /**
     * process service
     *
     * @private
     * @type {ProcessService}
     * @memberof ProcessListComponent
     */
    private processService: ProcessService;

    /**
     * Creates an instance of TasksComponent.
     * @param {QlikSessionService} qlikSession
     * @memberof TasksComponent
     */
    constructor (
        processService: ProcessService
    ) {
        this.isDestroyed$ = new Subject();
        this.processService = processService;
    }

    /**
     * component get initialized, create a session app
     * and fetch values
     *
     * @memberof TasksComponent
     */
    ngOnInit() {
        this.loadProcessList().subscribe((processes) => {
            this.processes = processes;
            this.ready     = true;
        });
    }

    /**
     * component gets destroyed
     *
     * @memberof TasksComponent
     */
    ngOnDestroy(): void {
        this.isDestroyed$.next(true);
    }

    /**
     * load process list
     *
     * @private
     * @returns {Observable<IProcess[]>}
     * @memberof ProcessListComponent
     */
    private loadProcessList(): Observable<IProcess[]> {
        return this.processService.getProcessList()
            .pipe(
                /** @todo remove mock response */
                map(() => {
                    // tslint:disable-next-line:max-line-length
                    const mockResponse = '{"status":0,"tasks":[{"processId":0,"status":0,"id":"3fb43c86-6fd7-4503-a0da-33550d4ccf23","startTime":"2018-11-29T10:55:45.8066955+01:00","appId":"5d514ce0-1cf2-4b37-a687-6b53e6794357","userId":{"UserId":"martinberthold","UserDirectory":"AZUREAD"}}]}';
                    return JSON.parse(mockResponse).tasks;
                }),
                takeUntil(this.isDestroyed$)
            );
    }
}
