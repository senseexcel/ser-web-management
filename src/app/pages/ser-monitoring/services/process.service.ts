import { Injectable } from '@angular/core';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { Observable, of, Subject, BehaviorSubject, from } from 'rxjs';
import { SerCommands } from '../api/ser-commands.interface';
import { IProcessListResponse, ResponseStatus } from '../api/process-status-response.interface';
import { IProcess } from '../api/process.interface';
import { ProcessStatusException } from '../api';
import { ILicenseValidationResult } from '@smc/pages/license/api/validation-result.interface';
import { EnigmaService } from '@smc/modules/smc-common';

@Injectable()
export class ProcessService {

    /**
     * observable for process has been stopped
     *
     * @type {Subject<IProcess>}
     * @memberof ProcessService
     */
    public processStop$: Subject<IProcess>;

    /**
     * observable for process list has been updated
     *
     * @type {Subject<IProcess[]>}
     * @memberof ProcessService
     */
    public processList$: BehaviorSubject<IProcess[]>;

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
    private processMap: Map<string, IProcess>;

    /**
     * cache session app
     *
     * @private
     * @type {EngineAPI.IApp}
     * @memberof TasksComponent
     */
    private sessionApp: EngineAPI.IApp;
    private enigmaService: EnigmaService;

    /**
     * Creates an instance of ProcessService.
     * @param {QlikSessionService} session
     * @memberof ProcessService
     */
    constructor(enigmaService: EnigmaService) {
        this.enigmaService = enigmaService;

        this.processList$ = new BehaviorSubject([]);
        this.processMap = new Map();
        this.processStop$ = new Subject();
    }

    /**
     * fetch all processes from qrs
     *
     * @returns {Observable<string>}
     * @memberof ProcessService
     */
    public fetchProcesses(): Observable<IProcess[]> {

        return this.getSessionApp()
            .pipe(
                switchMap((app: EngineAPI.IApp) => {
                    const requestData = JSON.stringify({
                        tasks: 'all'
                    });
                    return app.evaluate(`${SerCommands.STATUS}('${requestData}')`);
                }),
                map((response: string) => {
                    const result: IProcessListResponse = JSON.parse(response);
                    console.log(result);
                    if (result.status === ResponseStatus.FAILURE) {
                        throw new ProcessStatusException('Could not fetch processes.');
                    }
                    return this.mergeProcessesToMap(result.tasks);
                }),
                tap((processes: IProcess[]) => this.processList$.next(processes))
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
     * load process list and submits new event for processListUpdate
     *
     * @returns {Observable<IProcess[]>}
     * @memberof ProcessService
     */
    public refreshProcessList(): Observable<IProcess[]> {
        return this.fetchProcesses().pipe(
            tap((response: IProcess[]) => this.processList$.next(response))
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
                console.log(`${SerCommands.STOP}('${requestData}')`);
                return app.evaluate(`${SerCommands.STOP}('${requestData}')`);
            }),
            tap(() => {
                this.processMap.delete(process.taskId);
                this.processList$.next(
                    Array.from(this.processMap.values())
                );
            }),
            map(() => {
                return true;
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
            return from(this.enigmaService.createSessionApp())
                .pipe(
                    tap((app: EngineAPI.IApp) => this.sessionApp = app)
                );
        }
        return of(this.sessionApp);
    }

    /**
     * merge loaded / updated processes into map we want to modify
     * existing objects if they are allready loaded and not create
     * every time a new object. This will help the angular renderer
     * to render only things wo have changed and not all.
     *
     * @private
     * @param {IProcess[]} processes
     * @memberof ProcessService
     */
    private mergeProcessesToMap(processes: IProcess[]): IProcess[] {
        const mergedMap: Map<string, IProcess> = new Map();
        processes.forEach((process: IProcess) => {
            if (this.processMap.has(process.taskId)) {
                const mergedProcess = Object.assign(this.processMap.get(process.taskId), process);
                mergedMap.set(process.taskId, mergedProcess);
                return;
            }
            mergedMap.set(process.taskId, process);
        });
        this.processMap = mergedMap;
        return Array.from(this.processMap.values());
    }
}
