import { Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';
import { ReportService } from '@core/modules/ser-report/services/report.service';
import { IQlikApp } from '@apps/api/app.interface';
import { FormService } from '@core/modules/form-helper/provider/form.service';
import { Subject, from, of } from 'rxjs';
import { switchMap, map, filter, catchError, takeUntil } from 'rxjs/operators';
import { ISerFormResponse, ISerReportFormGroup } from '@apps/api/ser-form.response.interface';
import { BreadcrumbService } from '@breadcrumb/provider/breadcrumb.service';
import { IBreadCrumb } from '@breadcrumb/api/breadcrumb.interface';
import { ITask } from '@core/modules/ser-engine/api/task.interface';
import { SerTaskService } from '@core/modules/ser-engine/provider/ser-task.service';
import { ModalService } from '@core/modules/modal/services/modal.service';

@Component({
    selector: 'app-qlik-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    providers: [FormService]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IQlikApp[];
    public properties: any[];
    public associatedItems: any;
    public selectedProperty: any;
    public isLoading = true;
    public formService: FormService<ISerApp, ISerFormResponse>;
    public formDataLoaded = false;
    public isSubRoute = false;
    public taskCount = 0;

    @HostBinding('class.flex-container')
    protected hostClass = true;

    @ViewChild('connections')
    private connectionsContainer: ElementRef;

    @ViewChild('distribute')
    private distributeContainer: ElementRef;

    @ViewChild('template')
    private templateContainer: ElementRef;

    @ViewChild('selections')
    private selectionContainer: ElementRef;

    @ViewChild('settings')
    private settingsContainer: ElementRef;

    private isDestroyed$: Subject<boolean>;
    private activeRoute: ActivatedRoute;
    private appManager: SerAppManagerService;
    private app: ISerApp;
    private reportService: ReportService;
    private router: Router;
    private breadCrumbService: BreadcrumbService;
    private taskApiService: SerTaskService;
    private location: Location;
    private modalService: ModalService;

    constructor(
        activeRoute: ActivatedRoute,
        appManager: SerAppManagerService,
        formService: FormService<ISerApp, ISerFormResponse>,
        location: Location,
        modalService: ModalService,
        reportService: ReportService,
        router: Router,
        breadcrumbService: BreadcrumbService,
        taskApiService: SerTaskService
    ) {
        this.location = location;
        this.modalService = modalService;
        this.isDestroyed$ = new Subject<boolean>();
        this.activeRoute = activeRoute;
        this.appManager = appManager;
        this.formService = formService;
        this.reportService = reportService;
        this.router = router;
        this.breadCrumbService = breadcrumbService;

        this.taskApiService = taskApiService;
    }

    public cancel() {
        const title = `Warning`;
        const message = `Cancel current process will discard all changes.\n\nContinue ?`;

        this.modalService.openDialog(title, message)
            .switch.subscribe((confirm) => {
                if (confirm) {
                    this.location.back();
                }
            });
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
    public ngOnInit() {

        this.isLoading = true;

        this.properties = [
            { label: 'App' },
            { label: 'Template' },
            { label: 'Selections' },
            { label: 'Distribution' },
            { label: 'Settings' }
        ];

        const params = this.activeRoute.snapshot.params;
        const app$   = this.appManager.loadApps();

        const serApp$ = this.initExistingApp(params.id);

        app$.pipe(
            switchMap(() => serApp$),
            takeUntil(this.isDestroyed$)
        )
        .subscribe((tasks: ITask[]) => {
            this.associatedItems = [{
                label: 'Tasks',
                items: 'tasks',
                route: 'tasks',
                count: tasks.length
            }];
            this.formDataLoaded = true;
        });

        this.breadCrumbService.breadcrumbs
            .subscribe((breadcrumbs: IBreadCrumb[]) => {
                const breadcrumb = breadcrumbs.slice(-1)[0];
                if (breadcrumb.data.page === 'detail') {
                    this.isSubRoute = false;
                } else {
                    this.isSubRoute = true;
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

        this.updateReportData()
            .pipe(
                map(() => {
                    /** save app */
                    return this.appManager.saveApp(this.app);
                }),
                catchError(() => {
                    return of(null);
                })
            )
            .subscribe((app: ISerApp) => {
                let title: string;
                let message: string;

                if (app) {
                    title   = `Success`;
                    message = `App was successfully saved.`;
                    this.modalService.openMessageModal(title, message);
                } else {
                    title   = `An error occurred.`;
                    message = `Application could not saved.`;
                    this.modalService
                        .openMessageModal(title, message);
                }
            });
    }

    public preview() {
        // save model first ?
        this.updateReportData().subscribe(() => {
            this.isSubRoute = true;
            this.router.navigate(['./preview'], { relativeTo: this.activeRoute });
        });
    }

    public showTasks() {
        // save model first ?
        this.updateReportData().subscribe(() => {
            this.isSubRoute = true;
            this.router.navigate(['./tasks', this.app.appId], { relativeTo: this.activeRoute });
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
            case 'selections':
                scrollToContainer = this.selectionContainer;
                break;
            case 'distribution':
                scrollToContainer = this.distributeContainer;
                break;
            case 'settings':
                scrollToContainer = this.settingsContainer;
                break;
            default:
                return;
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

        return this.formService.updateModel()
            .pipe(
                map((formData: ISerFormResponse[]) => {
                    /** read form data and update report model with given values */
                    formData.forEach((response: ISerFormResponse) => {

                        if (!response.data) {
                            return;
                        }

                        response.data.forEach((data: ISerReportFormGroup) => {
                            const group = data.group;
                            const path = data.path.length !== 0 ? data.path.split('/') : [];
                            const fields = data.fields;

                            this.reportService.updateReport(this.app.report, group, path, fields);
                        });
                    });
                })
            );
    }

    /**
    * initialize existing app
    *
    * @private
    * @memberof AppEditComponent
    */
    private initExistingApp(qDocId: string) {

        return this.appManager.fetchApp(qDocId)
            .pipe(
                switchMap((app: IQlikApp) => {
                    this.appManager.selectApps([app]);
                    return this.appManager.openApp(app);
                }),
                switchMap((app: ISerApp) => {
                    this.app = app;
                    this.formService.loadModel(app);
                    this.apps = this.appManager.getSelectedApps();
                    // load tasks
                    return this.taskApiService.fetchTasksForApp(app.appId);
                })
            );
    }
}
