import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProcessService } from '../../services';
import { takeUntil, map } from 'rxjs/operators';
import { IProcess } from '../../api';

@Component({
    selector: 'smc-monitoring-process-list',
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
    ngOnInit(): void {

        this.processService.processList$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((processes) => {
                this.processes = processes;
                this.ready     = true;

                // register for further events
                this.processes = [...processes];
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
     * stop process, this will trigger an update on list
     * which will handeled on processListUpdate Stream
     *
     * @memberof MonitoringPageComponent
     */
    public stopProcess(process: IProcess) {

        this.processService.stopProcess(process)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => {
                /** @todo implement any usefull action ... */
            });
    }
}
