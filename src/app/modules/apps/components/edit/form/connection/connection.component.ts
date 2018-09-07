import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IQlikApp } from '@apps/api/app.interface';
import { map, mergeMap, filter, mergeAll, flatMap } from 'rxjs/operators';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';
import { SerAppManagerService } from '@core/ser-app/provider/ser-app-manager.service';
import { EditAppService } from '@apps/provider/edit-app.service';
import { empty, forkJoin, from, Observable } from 'rxjs';

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

    private editService: EditAppService;

    constructor(
        formBuilder: FormBuilder,
        appManager: SerAppManagerService,
        editService: EditAppService
    ) {
        this.formBuilder = formBuilder;
        this.appManager  = appManager;
        this.editService = editService;
    }

    ngOnDestroy() {
        // @todo implement
    }

    ngOnInit() {

        this.editService.loadApp()
        .pipe(
            mergeMap( (app: ISerApp) => {
                return this.loadAvailableApps(app);
            })
        )
        .subscribe ((result) => {
            this.currentApp = result.app;
            this.apps       = result.apps;

            if ( this.currentApp ) {
                this.connectionForm = this.buildFormGroup();
            }
        });
    }

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

    private buildFormGroup(): FormGroup {

        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(this.currentApp.report.connections.app, Validators.required)
        });

        return formGroup;
    }

    private updateForm() {
        // @todo implement
    }
}
