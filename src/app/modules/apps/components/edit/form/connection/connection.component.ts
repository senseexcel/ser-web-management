import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IQlikApp } from '@apps/api/app.interface';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-edit-form-app',
    templateUrl: 'connection.component.html'
})

export class ConnectionComponent implements OnInit, OnDestroy {

    public connectionForm: FormGroup;

    public apps: IQlikApp[];

    private formBuilder: FormBuilder;

    constructor(
        formBuilder: FormBuilder,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnDestroy() {
        // @todo implement
    }

    ngOnInit() {

        /*
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
            */
    }

    public applyConfig() {

        /*
        this.appProvider.writeConnectionConfiguration({
            app: this.connectionForm.get('app').value
        });
        */
    }

    public cancel() {}

    private buildFormGroup(): FormGroup {
        /*
        const config = this.appProvider.resolveConnectionConfig();
        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(config.app, Validators.required)
        });

        return formGroup;
        */
       return null;
    }
}
