import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { IQlikApp } from '@apps/api/app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { ConnectionComponent, DistributionComponent, SettingsComponent, TemplateComponent} from './form';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    providers: [ FormService ]
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
                this.formService.editApp(app);
            });
    }

    private save() {
        /** @todo implement */
        this.formService.updateApp()
        .subscribe( (app: ISerApp) => {
            console.log(app);
        });
    }

    private cancel() {
    }

    /**
     * get notified if app ser configuration has been changed
     *
     * @private
     * @returns {Observable<void>}
     * @memberof AppEditComponent
     */
    private onUpdate(): void  {
    }
}
