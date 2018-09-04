import { Component, OnInit, OnDestroy, HostBinding, Injector, ReflectiveInjector } from '@angular/core';
import * as hjson from 'hjson';
import { ConnectionComponent, GeneralComponent, TemplateComponent} from './form';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { ISERApp } from '@qlik/api/ser.response.interface';
import { SerAppProvider, SerConfigProvider, SelectionProvider } from '@qlik/provider';
import { ISerConfiguration } from '@qlik/api/ser-config.interface';
import { IScriptData } from '@qlik/api/script-data.interface';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    providers: [ SerConfigProvider ],
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: ISERApp[];

    public properties: any;

    public selectedProperty: any;

    public isLoading = true;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private selectionProvider: SelectionProvider;

    private serAppProvider: SerAppProvider;

    private serConfigProvider: SerConfigProvider;

    private qApp: EngineAPI.IApp;

    private script: IScriptData;

    private isDestroyed$: Subject<boolean>;

    private formInjector: Injector;

    constructor(
        selectionProvider: SelectionProvider,
        serAppProvider: SerAppProvider,
        serConfigProvider: SerConfigProvider,
        injector: Injector
    ) {
        this.selectionProvider = selectionProvider;
        this.serAppProvider    = serAppProvider;
        this.serConfigProvider = serConfigProvider;
        this.isDestroyed$      = new Subject<boolean>();

        this.formInjector = ReflectiveInjector.resolveAndCreate(
            [{ provide: 'QlikApp', useValue: this.selectionProvider.getSelection()[0].qapp }],
            injector
        );
    }

    ngOnDestroy(): void {

        this.isDestroyed$.next(true);

        if ( this.qApp ) {
            this.qApp.session.close();
        }
    }

    ngOnInit() {

        if ( this.selectionProvider.hasSelection() ) {
            this.isLoading = true;
            this.properties = [
                { label: 'Connection'  , component: ConnectionComponent },
                { label: 'Distribution', component: ConnectionComponent },
                { label: 'General'     , component: GeneralComponent    },
                { label: 'Template'    , component: TemplateComponent   },
            ];

            this.apps = this.selectionProvider.getSelection();

            this.serAppProvider.loadApp(this.apps[0].qapp.qDocId)
                .subscribe( async (app: EngineAPI.IApp) => {
                    const script = await app.getScript();

                    this.qApp = app;
                    this.script = this.serAppProvider.parseScript(script);
                    this.serConfigProvider.loadConfiguration(this.script.serConfig);
                    this.isLoading = false;
                });

            this.onConfigurationUpdate();
        }
    }

    public showForm(property) {
        this.selectedProperty = property;
    }

    private onConfigurationUpdate() {

        this.serConfigProvider.update$
            .pipe(
                map( (config: ISerConfiguration): string => {
                    const newScript = ''.concat(
                        this.script.before,
                        hjson.stringify(config),
                        this.script.after
                    );
                    return newScript;
                }),
                switchMap( (script) => {
                    return this.qApp.setScript(script);
                }),
                takeUntil( this.isDestroyed$ )
            )
            .subscribe( () => {
                console.log('app script saved');
            });
    }
}
