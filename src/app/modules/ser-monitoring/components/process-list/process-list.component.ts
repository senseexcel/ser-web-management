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
    ngOnInit(): void {

        this.loadProcessList()
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((processes) => {
                this.processes = processes;
                this.ready     = true;

                // register for further events
                this.registerEvents();
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
     * register for process list refresh and process stop event
     *
     * @private
     * @memberof ProcessListComponent
     */
    private registerEvents(): void {

        /** process list refreshed */
        this.processService.processListUpdate$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((processes: IProcess[]) => this.updateProcessList(processes));

        /** process stopped */
        this.processService.processStop$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((process: IProcess) => this.removeProcessFromList(process) );
    }

    /**
     * load process list
     *
     * @private
     * @returns {Observable<IProcess[]>}
     * @memberof ProcessListComponent
     */
    private loadProcessList(): Observable<IProcess[]> {

        return this.processService.getProcessList().pipe(
            takeUntil(this.isDestroyed$)
        );
    }

    /**
     * find process which has been removed and remove from
     * internal process list
     *
     * @private
     * @param {IProcess} process
     * @memberof ProcessListComponent
     */
    private removeProcessFromList(process: IProcess): void {
        // @todo implement
    }

    /**
     * we get a complete list of new processes, so we should
     * merge both together to handle table rendering better so only
     * added or removed elements will be rendered and not complete table
     *
     * @private
     * @param {IProcess[]} processes
     * @memberof ProcessListComponent
     */
    private updateProcessList(processes: IProcess[]): void {
        this.processes = [...processes];
    }
}
