import { Component, OnInit, OnDestroy, HostBinding, Injector, ReflectiveInjector } from '@angular/core';
import * as hjson from 'hjson';
import { ConnectionComponent, GeneralComponent, TemplateComponent} from './form';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { SelectionProvider } from '@qlik/provider';
import { ISerConfiguration } from '@qlik/api/ser-config.interface';
import { SerAppProvider, ReportProvider, ISerApp, ISerConfig, IScriptData } from '@ser-app/index';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html'
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: ISerApp[];
    public properties: any;
    public selectedProperty: any;
    public isLoading = true;
    public formInjector: Injector;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private selectionProvider: SelectionProvider;
    private serAppProvider: SerAppProvider;
    private reportProvider: ReportProvider;
    private qApp: EngineAPI.IApp;
    private reportConfig: ISerConfig;
    private script: IScriptData;
    private isDestroyed$: Subject<boolean>;

    constructor(
        selectionProvider: SelectionProvider,
        serAppProvider: SerAppProvider,
        reportProvider: ReportProvider ,
        injector: Injector
    ) {
        this.selectionProvider = selectionProvider;
        this.serAppProvider    = serAppProvider;
        this.reportProvider    = reportProvider;
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

                    this.reportProvider.loadConfigurationFromJson(script);

                    this.qApp         = app;
                    this.script       = this.reportProvider.parseSerAppScript(script);
                    this.reportConfig = this.script.config;
                    this.isLoading    = false;
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
