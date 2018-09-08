import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IQlikApp } from '@apps/api/app.interface';
import { map, mergeMap, filter, mergeAll, flatMap } from 'rxjs/operators';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { FormService, IFormResponse } from '@core/modules/form-helper';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-edit-form-app',
    templateUrl: 'connection.component.html'
})
export class ConnectionComponent implements OnInit, OnDestroy {

    public connectionForm: FormGroup;
    public apps: IQlikApp[];
    public currentApp: ISerApp;

    private formBuilder: FormBuilder;
    private appManager: SerAppManagerService;
    private formService: FormService<ISerApp>;
    private updateHook: Observable<any>;

    constructor(
        formBuilder: FormBuilder,
        appManager: SerAppManagerService,
        formService: FormService<ISerApp>
    ) {
        this.formBuilder = formBuilder;
        this.appManager  = appManager;
        this.formService = formService;
    }

    /**
     * on component get destroyed
     *
     * @memberof ConnectionComponent
     */
    ngOnDestroy() {
        // @todo implement
        this.formService.unRegisterHook(FormService.HOOK_UPDATE, this.updateHook);
    }

    /**
     * on component will be initialized
     *
     * @memberof ConnectionComponent
     */
    ngOnInit() {

        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        /** register on app has been loaded */
        this.formService.loadApp()
        .pipe(
            mergeMap( (app: ISerApp) => {
                return this.loadAvailableApps(app);
            })
        )
        .subscribe ((result) => {
            this.currentApp = result.app;
            this.apps       = result.apps;

            if ( this.currentApp ) {
                /** @todo should only update form fields and not create every time a new form group */
                this.connectionForm = this.buildFormGroup();
            }
        });
    }

    /**
     * load all available apps which can used as connection
     *
     * @private
     * @param {ISerApp} app
     * @returns {Observable<{app: ISerApp, apps: IQlikApp[]}>}
     * @memberof ConnectionComponent
     */
    private loadAvailableApps(app: ISerApp): Observable<{app: ISerApp, apps: IQlikApp[]}> {

        return this.appManager.loadApps()
        .pipe(
            map( (apps: IQlikApp[]) => {
                return apps.filter( (qapp: IQlikApp) => {
                    return app !== null && qapp.qDocId !== app.appId;
                });
            }),
            map( (apps: IQlikApp[]) => {
                return {app, apps};
            })
        );
    }

    /**
     * build a form group for connection
     *
     * @private
     * @returns {FormGroup}
     * @memberof ConnectionComponent
     */
    private buildFormGroup(): FormGroup {

        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(this.currentApp.report.connections.app, Validators.required)
        });

        return formGroup;
    }

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<IFormResponse> {

        const observer = new Observable<IFormResponse>((obs) => {
            obs.next({
                errors: [],
                valid: true,
            });
        });
        return observer;
    }
}
