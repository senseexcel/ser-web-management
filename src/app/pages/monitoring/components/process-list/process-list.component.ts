import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, empty, from, concat } from 'rxjs';
import { ProcessService } from '../../services';
import { takeUntil, switchMap, tap, repeat, delay, finalize } from 'rxjs/operators';
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

    public translateParams = {
        stop: {
            COUNT: 0
        }
    };

    /**
     * selections we have made
     *
     * @type {SelectionModel<IProcess>}
     * @memberof ProcessListComponent
     */
    public selections: SelectionModel<IProcess> = new SelectionModel(true);

    /**
     * all tasks which are displayed, we dont want to create
     * a new list allways since this will recrate all table list
     * nodes, but if we only update them they will not completly rerendered
     * only the content changes.
     *
     * @private
     * @type {Map<number, IProcess>}
     * @memberof ProcessListComponent
     */
    private activeTasks: Map<string, IProcess> = new Map();

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
    private reloadInterval = 1000;

    /**
     * flag we have enabled automatic reloading,
     * if true this will fetch and repeat until autoReloadEnabled is
     * set to false
     *
     * @private
     * @memberof ProcessListComponent
     */
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

        this.selections.changed.subscribe(() => {
            this.translateParams.stop = { COUNT: this.selections.selected.length };
        });
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
        const interval$ = this.processService.fetchProcesses().pipe(
            tap((tasks) => this.tasks = this.mergeTasks(tasks)),
            delay(this.reloadInterval),
            repeat()
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
        if (!this.autoReloadEnabled && !this.fetchingData) {
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
        this.fetchingData = true;

        /** build stop requests as array */
        const stop$ = this.selections.selected.map(
            (process) => this.processService.stopProcess(process)
                .pipe(
                    switchMap(() => this.processService.fetchProcesses()),
                    delay(1000),
                )
        );

        /**
         * run all stop streams, one by one if all completed,
         * if process has been stopped and we got task informations
         * merge tasks into active list
         *
         * once all have been done disable loading flag
         */
        concat(...stop$)
            .pipe(finalize(() => this.fetchingData = false))
            .subscribe((tasks) => this.tasks = this.mergeTasks(tasks));
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
            .subscribe((tasks) => {
                if (!this.autoReloadEnabled) {
                    this.fetchingData = false;
                }

                this.tasks = this.mergeTasks(tasks);
            });
    }

    /**
     * merges tasks from response with current app list
     * @todo check we need to run outside of change detection since we make many opertations here
     *
     * @private
     * @param {IProcess[]} tasks
     * @returns {IProcess[]}
     * @memberof ProcessListComponent
     */
    private mergeTasks(tasks: IProcess[]): IProcess[] {

        /** all tasks ids, updated tasks will be removed from this so they can be deleted */
        const deletedTasks: string[] = Array.from(this.activeTasks.keys());

        tasks.forEach((task) => {
            /** tasks should be updated remove from deletedTasks */
            if (this.activeTasks.has(task.taskId)) {
                const target = this.activeTasks.get(task.taskId);
                this.activeTasks.set(task.taskId, this.copyToProcess(task, target));
                deletedTasks.splice(deletedTasks.indexOf(task.taskId), 1);
                return;
            }
            /** this task not exists currently in list and should be added */
            this.activeTasks.set(task.taskId, task);
        });

        /**
         * all tasks which are remain now in deleted tasks could be removed
         * we need to remove tasks from selections if they not exists anymore
         * so selection will be clear
         */
        let tempSelectedTasks = deletedTasks.map((id) => {
            const task = this.activeTasks.get(id);
            this.activeTasks.delete(id);
            return task;
        });
        this.selections.deselect(...tempSelectedTasks);
        tempSelectedTasks = null;

        return Array.from(this.activeTasks.values());
    }

    /**
     * copy data from source object to target object
     * which helps the main object which will watched from angular
     * will not removed
     *
     * @private
     * @param {*} source
     * @param {*} target
     * @returns {IProcess}
     * @memberof ProcessListComponent
     */
    private copyToProcess(source, target): IProcess {
        // Object.assign would not work in IE so we have to copy old school
        Object.keys(source).forEach((property) => {
            target[property] = source[property];
        });
        return target;
    }
}
