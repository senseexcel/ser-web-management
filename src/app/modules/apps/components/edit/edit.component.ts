import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { IQlikApp } from '@apps/api/app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Subject, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ConnectionComponent, DistributionComponent, SettingsComponent, TemplateComponent} from './form';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    providers: [FormService]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IQlikApp[];
    public properties: any[];
    public selectedProperty: any;
    public isLoading = true;
    public formService: FormService<ISerApp>;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private isDestroyed$: Subject<boolean>;
    private activeRoute: ActivatedRoute;
    private appManager: SerAppManagerService;
    private app: ISerApp;

    constructor(
        activeRoute: ActivatedRoute,
        appManager: SerAppManagerService,
        formService: FormService<ISerApp>
    ) {
        this.isDestroyed$ = new Subject<boolean>();
        this.activeRoute  = activeRoute;
        this.appManager   = appManager;
        this.formService  = formService;
    }

    public ngOnDestroy(): void {
        this.appManager.closeApp(this.app);
        this.isDestroyed$.next(true);
    }

    public ngOnInit () {

        this.isLoading = true;
        this.properties = [
            { label: 'App'         , component: ConnectionComponent   },
            { label: 'Template'    , component: TemplateComponent     },
            { label: 'Distribution', component: DistributionComponent },
            { label: 'Settings'    , component: SettingsComponent     },
        ];

        const params = this.activeRoute.snapshot.params;

        if ( params.hasOwnProperty('id') ) {
            this.initExistingApp();
        } else {
            this.initNewApp(params.name);
        }
    }

    public showForm(property) {
        this.selectedProperty = property;
    }

    /**
     * initialize new app
     *
     * @private
     * @memberof AppEditComponent
     */
    private initNewApp(name: string) {

        this.appManager.createApp(name)
        .subscribe( (app: ISerApp) => {
            this.app = app;
            this.formService.editApp(app);
        });
    }

    /**
     * initialize existing app
     *
     * @private
     * @memberof AppEditComponent
     */
    private initExistingApp() {

        this.apps = this.appManager.getSelectedApps();
        this.appManager.openApp(this.apps[0].qDocId)
            .subscribe((app: ISerApp) => {
                this.app = app;
                this.formService.editApp(app);
            });
    }

    /**
     * on save app, let the form service update the app
     *
     * @private
     * @memberof AppEditComponent
     */
    private save() {
        this.formService.updateApp()
        .pipe(
            mergeMap( () => {
                return this.appManager.saveApp(this.app);
            })
        )
        .subscribe(() => {
            console.log('app saved');
        });
    }

    private cancel() {
    }
}
