import { Component, OnInit, OnDestroy, Inject, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SerAppProvider } from '@ser-app/provider/ser-app.provider';
import { ReportConfigProvider } from '@ser-app/provider/report-config.provider';
import { ISerConnection } from 'ser.api';
import { IQlikApp } from '@qlik/api/app.interface';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-qapp-edit-connection',
    templateUrl: 'connection.component.html'
})

export class ConnectionComponent implements OnInit, OnDestroy {

    public connectionForm: FormGroup;

    public apps: IQlikApp[];

    @HostBinding('class')
    protected hostClass = 'flex-container flex-column';

    private formBuilder: FormBuilder;

    private reportConfig: ReportConfigProvider;

    private serAppProvider: SerAppProvider;

    private currentApp: IQlikApp;

    constructor(
        formBuilder: FormBuilder,
        reportConfig: ReportConfigProvider,
        serAppProvider: SerAppProvider,
        @Inject('QlikApp') qApp: IQlikApp
    ) {
        this.formBuilder    = formBuilder;
        this.reportConfig   = reportConfig;
        this.serAppProvider = serAppProvider;
        this.currentApp = qApp;
    }

    ngOnDestroy() {
        // @todo implement
    }

    ngOnInit() {

        this.serAppProvider.fetchApps()
            .pipe(
                map( (apps: IQlikApp[]) => {
                    return apps.filter( (app: IQlikApp) => {
                        return app.qDocId !== this.currentApp.qDocId;
                    });
                })
            )
            .subscribe( (apps: IQlikApp[]) => {
                this.apps = apps;
                this.connectionForm = this.buildFormGroup();
            });
    }

    public applyConfig() {

        const config: ISerConnection = {
            app: this.connectionForm.get('app').value
        };

        this.reportConfig.writeConnectionConfiguration(null, config);
    }

    public cancel() {}

    private buildFormGroup(): FormGroup {

        const config = this.reportConfig.resolveConnectionConfig(SerConfigProperies.CONNECTION);
        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(config.app, Validators.required)
        });

        return formGroup;
    }
}
