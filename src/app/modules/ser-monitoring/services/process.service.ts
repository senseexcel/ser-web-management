import { Injectable } from '@angular/core';
import { QlikSessionService } from '@core/services';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SerCommands } from '../api/ser-commands.interface';
import { IProcessListResponse, ResponseStatus } from '../api/process-status-response.interface';
import { IProcess } from '../api/process.interface';
import { ProcessStatusException } from '../api';

@Injectable()
export class ProcessService {

    private qlikSession: QlikSessionService;

    /**
     * session app
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
                    return result.tasks;
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
}
