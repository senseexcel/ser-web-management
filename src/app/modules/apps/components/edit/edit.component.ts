import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { IQlikApp } from '@apps/api/app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Subject, } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ConnectionComponent, DistributionComponent, SettingsComponent, TemplateComponent} from './form';
import { ISerFormResponse, ISerReportFormGroup } from '@apps/api/ser-form.response.interface';

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
    public formService: FormService<ISerApp, ISerFormResponse>;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    private isDestroyed$: Subject<boolean>;
    private activeRoute: ActivatedRoute;
    private appManager: SerAppManagerService;
    private app: ISerApp;
    private reportService: ReportService;

    constructor(
        activeRoute: ActivatedRoute,
        appManager: SerAppManagerService,
        formService: FormService<ISerApp, ISerFormResponse>,
        reportService: ReportService
    ) {
        this.isDestroyed$  = new Subject<boolean>();
        this.activeRoute   = activeRoute;
        this.appManager    = appManager;
        this.formService   = formService;
        this.reportService = reportService;
    }

    public cancel() {
    }

    /**
     * on destroy component
     *
     * @memberof AppEditComponent
     */
    public ngOnDestroy(): void {
        this.appManager.closeApp(this.app);
        this.isDestroyed$.next(true);
    }

    /**
     * on initialize component
     *
     * @memberof AppEditComponent
     */
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

    /**
     * on save app, let the form service update the app
     *
     * @private
     * @memberof AppEditComponent
     */
    public save() {

        this.formService.updateApp()
        .pipe(
            mergeMap((formData: ISerFormResponse[]) => {
                /** read form data and update report model with given values */
                formData.forEach( (response: ISerFormResponse) => {

                    if ( ! response.data ) {
                        return;
                    }

                    // @todo quick and dirty make it better
                    response.data.forEach( (data: ISerReportFormGroup) => {
                        const group  = data.group;
                        /** @todo define path as array in interface */
                        const path   = data.path.length !== 0 ? data.path.split('/') : [];
                        const fields = data.fields;

                        this.reportService.updateReport(this.app.report, group, path, fields);
                    });
                });

                /** save app */
                return this.appManager.saveApp(this.app);
            })
        )
        .subscribe(() => {
            console.log('app saved');
        });
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
}
