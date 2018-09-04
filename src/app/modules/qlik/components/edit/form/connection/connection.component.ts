import { Component, OnInit, OnDestroy, Inject, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SerConfigProvider, SerConfigProperies, SerAppProvider, SelectionProvider } from '@qlik/provider';
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

    private serConfig: SerConfigProvider;

    private serAppProvider: SerAppProvider;

    private currentApp: IQlikApp;

    constructor(
        formBuilder: FormBuilder,
        serConfig: SerConfigProvider,
        serAppProvider: SerAppProvider,
        @Inject('QlikApp') qApp: IQlikApp
    ) {
        this.formBuilder    = formBuilder;
        this.serConfig      = serConfig;
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

        this.serConfig.writeConfigValue(SerConfigProperies.CONNECTION, config);
    }

    public cancel() {}

    private buildFormGroup(): FormGroup {

        const config = this.serConfig.getConfig(SerConfigProperies.CONNECTION) as ISerConnection;
        console.log(config);
        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(config.app, Validators.required)
        });

        return formGroup;
    }
}
