import { Injectable } from '@angular/core';
import { QlikSessionService } from '@core/services';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { SerCommands } from '../api/ser-commands.interface';
import { IProcessListResponse, ResponseStatus } from '../api/process-status-response.interface';
import { IProcess } from '../api/process.interface';
import { ProcessStatusException } from '../api';

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
    public processListUpdate$: Subject<IProcess[]>;

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
     * cache qlik session
     *
     * @private
     * @type {QlikSessionService}
     * @memberof ProcessService
     */
    private qlikSession: QlikSessionService;

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
    constructor(session: QlikSessionService) {
        this.qlikSession = session;

        this.processListUpdate$ = new Subject();
        this.processMap         = new Map();
        this.processStop$       = new Subject();
    }

    /**
     * fetch all processes from qrs
     *
     * @returns {Observable<string>}
     * @memberof ProcessService
     */
    public getProcessList(): Observable<IProcess[]> {
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
                    if (result.status === ResponseStatus.FAILURE ) {
                        throw new ProcessStatusException('Could not fetch processes.');
                    }
                    /** @todo uncomment line but since we get allways an empty result this will clear */
                    // return this.mergeProcessesToMap(result.tasks);
                    return result.tasks;
                }),
                /** @todo remove mocked response */
                map(() => {
                    const mockResponse: IProcess[] = [
                        ...((): IProcess[] => {
                            const length = Math.ceil(Math.random() * 10);
                            const processes = [];
                            for (let i = 0; i < length; i++) {
                                processes.push({
                                    processId: i,
                                    status: Math.round(Math.random() * 4),
                                    id: `5d514ce0-1cf2-4b37-a687-6b53e679435${i}`,
                                    startTime: '2018-11-29T10:55:45.8066955+01:00',
                                    appId: '5d514ce0-1cf2-4b37-a687-6b53e6794357',
                                    userId: {
                                        UserId: 'martinberthold',
                                        UserDirectory: 'AZUREAD'
                                    }
                                });
                            }
                            return processes;
                        })(),
                    ];
                    return this.mergeProcessesToMap(mockResponse);
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
        return this.getProcessList()
            .pipe(
                tap((response: IProcess[]) => this.processListUpdate$.next(response))
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
                    processId: process.id
                });
                return app.evaluate(`${SerCommands.STOP}('${requestData}')`);
            }),
            tap(() => this.processStop$.next(process)),
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
            return this.qlikSession.createSessionApp()
                .pipe(
                    tap((app: EngineAPI.IApp) => this.sessionApp = app)
                );
        }
        return of(this.sessionApp);
    }

    /**
     * merge loaded / updated processes into map
     *
     * @private
     * @param {IProcess[]} processes
     * @memberof ProcessService
     */
    private mergeProcessesToMap(processes: IProcess[]): IProcess[] {
        const mergedMap: Map<string, IProcess> = new Map();
        processes.forEach((process: IProcess) => {
            if (this.processMap.has(process.id)) {
                /**
                 * dont use object spread since this creates a new Object
                 * but we want to modify existing object this can be do better
                 * with Object.assign
                 */
                const mergedProcess = Object.assign(this.processMap.get(process.id), process);
                mergedMap.set(process.id, mergedProcess);
                return;
            }
            mergedMap.set(process.id, process);
        });
        this.processMap = mergedMap;
        return Array.from(this.processMap.values());
    }
}
