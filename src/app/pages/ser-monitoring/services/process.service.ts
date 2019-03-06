import { Injectable, OnDestroy } from '@angular/core';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { Observable, of, from, forkJoin, BehaviorSubject } from 'rxjs';
import { SerCommands } from '../api/ser-commands.interface';
import { IProcessListResponse, ResponseStatus } from '../api/process-status-response.interface';
import { IProcess, ProcessStatus } from '../api/process.interface';
import { ProcessStatusException } from '../api';
import { ILicenseValidationResult } from '@smc/pages/license/api/validation-result.interface';
import { EnigmaService } from '@smc/modules/smc-common';
import { AppRepository } from '@smc/modules/qrs';

@Injectable()
export class ProcessService {

    /**
     * observable for process list has been updated
     *
     * @type {Subject<IProcess[]>}
     * @memberof ProcessService
     */
    private _processList$: BehaviorSubject<IProcess[]>;

    /**
     * process which holds loaded processes
     * we want to merge loaded processes with all existing
     * processes, so we only modify Map existing processes
     * since only the state can change. This helps to render
     * not a full list only the changed processes.
     *
     * @private
     * @type {Map<string, IProcess>}
     * @memberof ProcessService
     */
    private processList: IProcess[] = [];

    /**
     * cache session app
     *
     * @private
     * @type {EngineAPI.IApp}
     * @memberof TasksComponent
     */
    private sessionApp: EngineAPI.IApp;

    /**
     * Creates an instance of ProcessService.
     * @param {QlikSessionService} session
     * @memberof ProcessService
     */
    constructor(
        private enigmaService: EnigmaService,
        private appRepository: AppRepository,
    ) {
        this._processList$ = new BehaviorSubject([]);
    }

    public get processList$(): Observable<IProcess[]> {
        return this._processList$.asObservable();
    }

    /**
     * fetch all processes from qrs
     *
     * @returns {Observable<string>}
     * @memberof ProcessService
     */
    public fetchProcesses(): Observable<IProcess[]> {

        return this.getSessionApp().pipe(
            switchMap((app: EngineAPI.IApp) => {
                const requestData = JSON.stringify({
                    tasks: 'all'
                });
                return app.evaluate(`${SerCommands.STATUS}('${requestData}')`);
            }),
            map((response: string) => {
                const result: IProcessListResponse = JSON.parse(response);
                if (result.status === ResponseStatus.FAILURE) {
                    throw new ProcessStatusException('Could not fetch processes.');
                }
                return result.tasks;
            }),
            switchMap((processes: IProcess[]) => {
                if (!processes.length) {
                    return of(processes);
                }

                const appName$ = processes.map((process) => {
                    const app$ = this.appRepository.fetchApp(process.appId);
                    return app$.pipe(map(app => {
                        process.appId = app.name;
                        return process;
                    }));
                });
                return forkJoin(...appName$);
            })
        );
    }

    /**
     *
     *
     * @memberof ProcessService
     */
    public async closeSession(): Promise<void> {
        await this.enigmaService.closeApp(this.sessionApp);
        this.sessionApp = null;
    }

    /**
     * validates user can open a sesssion
     *
     * @memberof ProcessService
     */
    public validateIsAllocated(): Observable<ILicenseValidationResult> {
        return this.getSessionApp().pipe(
            map((): ILicenseValidationResult => {
                return { isValid: true, errors: [] };
            }),
            catchError(() => {
                return of({
                    isValid: false,
                    errors: ['could not create session']
                });
            }),
        );
    }

    /**
     * stop process and submits new event for processStop
     *
     * @param {IProcess} process
     * @returns {Observable<boolean>}
     * @memberof ProcessService
     */
    public stopProcess(process: IProcess): Observable<boolean> {
        return this.getSessionApp().pipe(
            switchMap((app: EngineAPI.IApp) => {
                const requestData = JSON.stringify({
                    taskId: process.taskId
                });
                return app.evaluate(`${SerCommands.STOP}('${requestData}')`);
            }),
            map((response) => {
                const result: IProcessListResponse = JSON.parse(response);
                return result.status === ResponseStatus.SUCCESS;
            })
        );
    }

    /**
     * stop all running processes
     *
     * @returns {Observable<string>}
     * @memberof ProcessService
     */
    public stopAllProcesses(): Observable<boolean> {
        return this.getSessionApp().pipe(
            switchMap((app: EngineAPI.IApp) => {
                const requestData = JSON.stringify({
                    tasks: 'all'
                });
                return app.evaluate(`${SerCommands.STOP}('${requestData}')`);
            }),
            map((response: string) => {
                const result: IProcessListResponse = JSON.parse(response);
                return result.status === ResponseStatus.SUCCESS;
            })
        );
    }

    /**
     * get current or create new session app
     *
     * @returns {Observable<EngineAPI.IApp>}
     * @memberof ProcessService
     */
    private getSessionApp(): Observable<EngineAPI.IApp> {
        if (!this.sessionApp) {
            return from(this.enigmaService.createSessionApp()).pipe(
                tap((app: EngineAPI.IApp) => this.sessionApp = app)
            );
        }
        return of(this.sessionApp);
    }
}
