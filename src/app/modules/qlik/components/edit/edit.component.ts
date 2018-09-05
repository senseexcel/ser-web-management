import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ConnectionComponent, GeneralComponent, TemplateComponent} from './form';
import { empty, from } from 'rxjs';
import { map, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { SelectionProvider } from '@qlik/provider';
import { Subject, forkJoin, Observable } from 'rxjs';
import { AppProvider } from '../../provider/app.provider';
import { IQlikApp } from '@qlik/api/app.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    providers: [ AppProvider ]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IQlikApp[];
    public properties: any[];
    public selectedProperty: any;
    public isLoading = true;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private selectionProvider: SelectionProvider;
    private isDestroyed$: Subject<boolean>;
    private appProvider: AppProvider;
    private activeRoute: ActivatedRoute;
    private isNew: boolean;

    constructor(
        selectionProvider: SelectionProvider,
        appProvider: AppProvider,
        activeRoute: ActivatedRoute
    ) {
        this.selectionProvider = selectionProvider;
        this.isDestroyed$      = new Subject<boolean>();
        this.appProvider       = appProvider;
        this.activeRoute       = activeRoute;
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next(true);
        this.appProvider.closeApp();
    }

    public ngOnInit () {

        this.isLoading = true;
        this.properties = [
            { label: 'Connection'  , component: ConnectionComponent },
            { label: 'Distribution', component: ConnectionComponent },
            { label: 'General'     , component: GeneralComponent    },
            { label: 'Template'    , component: TemplateComponent   },
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

        this.appProvider.createApp()
        .pipe(
            switchMap( () => {
                this.isLoading = false;
                return this.onUpdate();
            })
        )
        .subscribe( () => {
            // app saved
        });
    }

    /**
     * initialize existing app
     *
     * @private
     * @memberof AppEditComponent
     */
    private initExistingApp() {

        if ( this.selectionProvider.hasSelection() ) {
            this.apps = this.selectionProvider.getSelection();
            this.appProvider.loadApp(this.apps[0].qDocId)
                .pipe(
                    /** once app has been loaded we switch the observable to update */
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
    }

    /**
     * get notified if app ser configuration has been changed
     *
     * @private
     * @returns {Observable<void>}
     * @memberof AppEditComponent
     */
    private onUpdate(): Observable<void> {

        return this.appProvider.onUpdate$
        .pipe(
            /** new configuration script is here, update app */
            map( async (script: string) => {
                this.isLoading = true;
                await this.appProvider.updateScript(script);
            }),
            /** convert to Observable<void> */
            map( () => {
                this.isLoading = false;
            }),
            /** if an error occured just return an empty observable */
            catchError( (error) => {
                /**
                 * @todo handle error here
                 * show message or something else ( no console )
                 */
                console.error(error);
                return empty();
            }),
            takeUntil( this.isDestroyed$ )
        );
    }
}
