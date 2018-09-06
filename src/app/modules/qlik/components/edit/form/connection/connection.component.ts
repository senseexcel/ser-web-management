import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SerAppProvider } from '@ser-app/provider';
import { IQlikApp } from '@qlik/api/app.interface';
import { map } from 'rxjs/operators';
import { AppProvider } from '@qlik/provider/app.provider';

@Component({
    selector: 'app-qapp-edit-connection',
    templateUrl: 'connection.component.html'
})

export class ConnectionComponent implements OnInit, OnDestroy {

    public connectionForm: FormGroup;

    public apps: IQlikApp[];

    @HostBinding('class')
    protected hostClass = 'flex-container flex-column';

    private serApiProvider: SerAppProvider;
    private appProvider: AppProvider;
    private formBuilder: FormBuilder;

    constructor(
        appProvider: AppProvider,
        formBuilder: FormBuilder,
        serApiProvider: SerAppProvider
    ) {
        this.formBuilder = formBuilder;
        this.appProvider = appProvider;
        this.serApiProvider = serApiProvider;
    }

    ngOnDestroy() {
        // @todo implement
    }

    ngOnInit() {

        this.serApiProvider.fetchApps()
            .pipe(
                map( (apps: IQlikApp[]) => {
                    return apps.filter( (app: IQlikApp) => {
                        return true;
                        // return app.qDocId !== this.currentApp.qDocId;
                    });
                })
            )
            .subscribe( (apps: IQlikApp[]) => {
                this.apps = apps;
                this.connectionForm = this.buildFormGroup();
            });
    }

    public applyConfig() {

        this.appProvider.writeConnectionConfiguration({
            app: this.connectionForm.get('app').value
        });
    }

    public cancel() {}

    private buildFormGroup(): FormGroup {
        const config = this.appProvider.resolveConnectionConfig();
        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(config.app, Validators.required)
        });

        return formGroup;
    }
}
