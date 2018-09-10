import { Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { IQlikApp } from '@apps/api/app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Subject, of, forkJoin, } from 'rxjs';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { ISerFormResponse, ISerReportFormGroup } from '@apps/api/ser-form.response.interface';
import { BreadcrumbService } from '@breadcrumb/provider/breadcrumb.service';
import { IBreadCrumb } from '@breadcrumb/api/breadcrumb.interface';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    providers: [FormService]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IQlikApp[];
    public properties: any[];
    public selectedProperty: any;
    public isLoading = true;
    public formService: FormService<ISerApp, ISerFormResponse>;
    public formDataLoaded = false;
    public isPreview = false;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    @ViewChild('connections')
    private connectionsContainer: ElementRef;

    @ViewChild('distribute')
    private distributeContainer: ElementRef;

    @ViewChild('template')
    private templateContainer: ElementRef;

    @ViewChild('settings')
    private settingsContainer: ElementRef;

    private isDestroyed$: Subject<boolean>;
    private activeRoute: ActivatedRoute;
    private appManager: SerAppManagerService;
    private app: ISerApp;
    private reportService: ReportService;
    private router: Router;
    private breadCrumbService: BreadcrumbService;

    constructor(
        activeRoute: ActivatedRoute,
        appManager: SerAppManagerService,
        formService: FormService<ISerApp, ISerFormResponse>,
        reportService: ReportService,
        router: Router,
        breadcrumbService: BreadcrumbService
    ) {
        this.isDestroyed$  = new Subject<boolean>();
        this.activeRoute   = activeRoute;
        this.appManager    = appManager;
        this.formService   = formService;
        this.reportService = reportService;
        this.router        = router;
        this.breadCrumbService = breadcrumbService;
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
        // @todo remove object
        this.properties = [
            { label: 'App'          },
            { label: 'Template'     },
            { label: 'Distribution' },
            { label: 'Settings'     },
        ];

        const params = this.activeRoute.snapshot.params;

        if ( params.hasOwnProperty('id') ) {
            this.initExistingApp();
        } else {
            this.initNewApp(params.name);
        }

        this.breadCrumbService.breadcrumbs
            .subscribe( (breadcrumbs: IBreadCrumb[]) => {
                const breadcrumb = breadcrumbs.slice(-1)[0];
                if ( breadcrumb.data.page === 'detail' ) {
                    this.isPreview = false;
                }
            });
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
            map(() => {
                /** save app */
                return this.appManager.saveApp(this.app);
            })
        )
        .subscribe(() => {
            console.log('app saved');
        });
    }

    public preview() {
        // save model first ?
        this.updateReportData().subscribe( () => {
            this.isPreview = true;
            this.router.navigate(['./preview'], { relativeTo: this.activeRoute });
        });
    }

    public showForm(property) {

        let scrollToContainer: ElementRef;

        switch (property.label.toLowerCase()) {
            case 'app':
                scrollToContainer = this.connectionsContainer;
                break;
            case 'template':
                scrollToContainer = this.templateContainer;
                break;
            case 'distribution':
                scrollToContainer = this.distributeContainer;
                break;
            case 'settings':
                scrollToContainer = this.settingsContainer;
                break;
        }

        scrollToContainer.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        this.selectedProperty = property;
    }

    /**
     * update formdata and save it to report
     *
     * @private
     * @returns
     * @memberof AppEditComponent
     */
    private updateReportData() {

        return this.formService.updateApp()
        .pipe(
            map((formData: ISerFormResponse[]) => {
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
            })
        );
    }

    /**
     * initialize new app
     *
     * @private
     * @memberof AppEditComponent
     */
    private initNewApp(name: string) {

        this.appManager.createApp(name)
        .pipe(
            switchMap( (app: ISerApp) => {
                this.app = app;
                this.formService.editApp(app);
                return this.appManager.loadApps();
            })
        )
        .subscribe( () => {
            this.formDataLoaded = true;
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
        this.appManager.openApp(this.apps[0])
            .pipe(
                switchMap( (app: ISerApp) => {
                    this.app = app;
                    this.formService.editApp(app);
                    return this.appManager.loadApps();
                })
            )
            .subscribe( () => {
                this.formDataLoaded = true;
            });
    }
}
