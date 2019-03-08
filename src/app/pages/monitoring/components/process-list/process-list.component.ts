import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval, empty, of } from 'rxjs';
import { ProcessService } from '../../services';
import { takeUntil, switchMap, tap, map } from 'rxjs/operators';
import { IProcess, ProcessStatus } from '../../api';
import { FormBuilder, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'smc-monitoring-process-list',
    styleUrls: ['./process-list.component.scss'],
    templateUrl: 'process-list.component.html'
})

export class ProcessListComponent implements OnDestroy, OnInit {

    /**
     *
     *
     * @type {FormControl}
     * @memberof ProcessListComponent
     */
    public autoRefreshControl: FormControl;

    /**
     * table header fields
     *
     * @memberof UserComponent
     */
    public columns = ['taskId', 'userId', 'appId', 'startTime', 'status'];

    /**
     * true if all data has been loaded
     *
     * @type {boolean}
     * @memberof ProcessListComponent
     */
    public ready = false;

    public fetchingData = false;

    /**
     * process list
     *
     * @private
     * @type {IProcess[]}
     * @memberof ProcessListComponent
     */
    public tasks: IProcess[] = [];

    public selections: SelectionModel<IProcess> = new SelectionModel(true);

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
     * interval for polling
     *
     * @private
     * @memberof ProcessListComponent
     */
    private reloadInterval = 5000;

    private autoReloadEnabled = false;

    /**
     * Creates an instance of TasksComponent.
     * @param {QlikSessionService} qlikSession
     * @memberof TasksComponent
     */
    constructor(
        private formBuilder: FormBuilder,
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
        this.autoRefreshControl = this.createAutoRefreshControl();
        this.loadProcesses();
    }

    /**
     * component gets destroyed
     *
     * @memberof TasksComponent
     */
    ngOnDestroy(): void {
        this.processService.closeSession();
        this.isDestroyed$.next(true);
    }

    /**
     * stop process, this will trigger an update on list
     * which will handeled on processListUpdate Stream
     *
     * @memberof MonitoringPageComponent
     */
    public stopProcess(process: IProcess) {

        process.requestPending = true;
        process.status = ProcessStatus.ABORTING;

        this.processService.stopProcess(process)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => {
                process.requestPending = false;
                this.loadProcesses();
            });
    }

    /**
     * enable auto refresh if checkbox is enabled
     *
     * @private
     * @returns {FormControl}
     * @memberof MonitoringPageComponent
     */
    private createAutoRefreshControl(): FormControl {

        const control = this.formBuilder.control('');
        const interval$ = interval(this.reloadInterval).pipe(
            tap(() => this.loadProcesses())
        );

        control.valueChanges.pipe(
            tap((value) => this.autoReloadEnabled = value),
            switchMap((val) => val ? interval$ : empty()),
            takeUntil(this.isDestroyed$),
        ).subscribe();

        return control;
    }

    /**
     * reload all processes
     *
     * @memberof ProcessListComponent
     */
    public doReload() {
        if (!this.autoReloadEnabled) {
            this.loadProcesses();
        }
    }

    public deselectAll() {
        this.selections.deselect(...this.selections.selected);
    }

    public selectAll() {
        this.selections.select(...this.tasks);
    }

    /**
     * stop all processes
     *
     * @memberof ProcessListComponent
     */
    public stopAll() {
        this.processService.stopAllProcesses()
            .subscribe(() => {
                this.loadProcesses();
            });
    }

    /**
     * fetch processes from server
     *
     * @private
     * @memberof ProcessListComponent
     */
    private loadProcesses() {

        if (!this.autoReloadEnabled) {
            this.fetchingData = true;
        }

        this.processService.fetchProcesses()
            .pipe(map(() => {
                const mockData = Array.from({ length: 100 }, (task, index) => {
                    const process: IProcess = {
                        appId: `app#${index}`,
                        startTime: new Date().toUTCString(),
                        status: Math.round(Math.random() * 4),
                        taskId: Math.random().toString(32),
                        userId: 'hannuscka/ralf',
                        requestPending: false
                    };
                    return process;
                });
                return mockData;
            }))
            .subscribe((tasks) => {
                this.deselectAll();

                if (!this.autoReloadEnabled) {
                    this.fetchingData = false;
                }

                /** only set if tasks length is not zero, or current tasks length not zero */
                if (tasks.length !== 0 || this.tasks.length !== 0) {
                    this.tasks = tasks;
                }
            });
    }
}
