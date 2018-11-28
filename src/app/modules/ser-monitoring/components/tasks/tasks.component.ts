import { Component, OnInit, OnDestroy } from '@angular/core';
import { QlikSessionService } from '@core/services';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SerCommands } from '../../api/ser-commands.interface';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-monitoring-tasks',
    templateUrl: 'tasks.component.html'
})

export class TasksComponent implements OnDestroy, OnInit {

    /**
     * session app
     *
     * @private
     * @type {EngineAPI.IApp}
     * @memberof TasksComponent
     */
    private sessionApp: EngineAPI.IApp;

    /**
     * emits true if component gets destroyed
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof TasksComponent
     */
    private isDestroyed$: Subject<boolean>;

    /**
     * service to create qlik session, qlik session apps
     *
     * @private
     * @type {QlikSessionService}
     * @memberof TasksComponent
     */
    private qlikSession: QlikSessionService;

    /**
     * Creates an instance of TasksComponent.
     * @param {QlikSessionService} qlikSession
     * @memberof TasksComponent
     */
    constructor (qlikSession: QlikSessionService) {
        this.qlikSession  = qlikSession;
        this.isDestroyed$ = new Subject();
    }

    /**
     * component get initialized, create a session app
     * and fetch values
     *
     * @memberof TasksComponent
     */
    ngOnInit() {

        this.qlikSession.createSessionApp()
            .pipe(
                switchMap((app: EngineAPI.IApp) => {
                    /** create session app */
                    this.sessionApp = app;
                    return this.sessionApp.evaluate(SerCommands.STATUS);
                }),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((fieldData: string) => {
                console.log(fieldData);
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
}
