import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ConnectionComponent, DistributionComponent, GeneralComponent, TemplateComponent} from './form';
import { empty, pipe } from 'rxjs';
import { map, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { IQlikApp } from '@apps/api/app.interface';
import { ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/ser-app/provider/ser-app-manager.service';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html'
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IQlikApp[];
    public properties: any[];
    public selectedProperty: any;
    public isLoading = true;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private isDestroyed$: Subject<boolean>;
    private activeRoute: ActivatedRoute;
    private appManger: SerAppManagerService;
    private isNew: boolean;

    constructor(
        activeRoute: ActivatedRoute,
        appManager: SerAppManagerService
    ) {
        this.isDestroyed$      = new Subject<boolean>();
        this.activeRoute       = activeRoute;
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
            { label: 'Settings'    , component: GeneralComponent      },
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

        /*
        this.appManger.createApp('initial name')
        .pipe(
            switchMap( () => {
                this.isLoading = false;
                return this.onUpdate();
            })
        )
        .subscribe( () => {
            // app saved
        });
        */
    }

    /**
     * initialize existing app
     *
     * @private
     * @memberof AppEditComponent
     */
    private initExistingApp() {

        /*
            this.apps = this.selectionProvider.getSelection();
            this.appProvider.loadApp(this.apps[0].qDocId)
                .pipe(
                    /** once app has been loaded we switch the observable to update *
                    switchMap( () => {
                        this.isLoading = false;
                        return this.onUpdate();
                    })
                )
                .subscribe(() => {
                    // app saved
                });
        } else {
            // @todo redirect to list
        }
        */
    }

    /**
     * get notified if app ser configuration has been changed
     *
     * @private
     * @returns {Observable<void>}
     * @memberof AppEditComponent
     */
    private onUpdate(): void  {

        /*
        return this.appProvider.onUpdate$
        .pipe(
            /** new configuration script is here, update app *
            map( async (script: string) => {
                this.isLoading = true;
                await this.appProvider.updateScript(script);
            }),
            /** convert to Observable<void> *
            map( () => {
                this.isLoading = false;
            }),
            /** if an error occured just return an empty observable *
            catchError( (error) => {
                /**
                 * @todo handle error here
                 * show message or something else ( no console )
                 *
                console.error(error);
                return empty();
            }),
            takeUntil( this.isDestroyed$ )
        );
        */
    }
}
