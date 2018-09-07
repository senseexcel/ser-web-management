import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/ser-app/api/ser-app.interface';
import { IQlikApp } from '@apps/api/app.interface';
import { EditAppService } from '@apps/provider/edit-app.service';
import { ConnectionComponent, DistributionComponent, SettingsComponent, TemplateComponent} from './form';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    providers: [ EditAppService ]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IQlikApp[];
    public properties: any[];
    public selectedProperty: any;
    public isLoading = true;
    public editService: EditAppService;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private isDestroyed$: Subject<boolean>;
    private activeRoute: ActivatedRoute;
    private appManager: SerAppManagerService;
    private isNew: boolean;

    constructor(
        activeRoute: ActivatedRoute,
        appManager: SerAppManagerService,
        editService: EditAppService
    ) {
        this.isDestroyed$ = new Subject<boolean>();
        this.activeRoute  = activeRoute;
        this.appManager    = appManager;
        this.editService = editService;
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

        if ( this.activeRoute.routeConfig.path === 'new' ) {
            this.initNewApp();
        } else {
            this.initExistingApp();
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
    private initNewApp() {

        this.appManager.createApp('initial name')
        .subscribe( (app: ISerApp) => {
            this.editService.editApp(app);
            console.dir(app);
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
                this.editService.editApp(app);
            });
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
