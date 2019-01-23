import { Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@smc/modules/ser/provider/report.service';
import { FormService } from '@smc/modules/form-helper/provider/form.service';
import { TaskRepository } from '@smc/modules/qrs';
import { Subject, of } from 'rxjs';
import { switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { ISerFormResponse, ISerReportFormGroup } from '../../api/ser-form.response.interface';
import { BreadcrumbService } from '@smc/modules/breadcrumb/provider/breadcrumb.service';
import { IBreadCrumb } from '@smc/modules/breadcrumb/api/breadcrumb.interface';
import { ITask } from '@smc/modules/qrs/api/task.interface';
import { ModalService } from '@smc/modules/modal';
import { IApp } from '@smc/modules/qrs';
import { IApp as ISerApp } from '@smc/modules/ser';
import { EnigmaService } from '@smc/modules/smc-common';

@Component({
    selector: 'smc-qlik-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    providers: [FormService]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public apps: IApp[];
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
    private app: ISerApp;
    private reportService: ReportService;
    private router: Router;
    private breadCrumbService: BreadcrumbService;
    private taskApiService: TaskRepository;
    private location: Location;
    private modalService: ModalService;

    constructor(
        activeRoute: ActivatedRoute,
        formService: FormService<ISerApp, ISerFormResponse>,
        location: Location,
        modalService: ModalService,
        reportService: ReportService,
        router: Router,
        breadcrumbService: BreadcrumbService,
        taskApiService: TaskRepository,
        private enigmaService: EnigmaService
    ) {
        this.location = location;
        this.modalService = modalService;
        this.isDestroyed$ = new Subject<boolean>();
        this.activeRoute = activeRoute;
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
        this.isDestroyed$.next(true);
    }

    /**
    * on initialize component
    *
    * @memberof AppEditComponent
    */
    public async ngOnInit() {

        this.isLoading = true;

        this.properties = [
            { label: 'App' },
            { label: 'Template' },
            { label: 'Selections' },
            { label: 'Distribution' },
            { label: 'Settings' }
        ];

        const params = this.activeRoute.snapshot.params;
        const app    = await this.enigmaService.openApp(params.id);
        const script = await app.getScript();

        /**  */

        /*
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
        }, () => {
            this.modalService.openMessageModal(
                'Found incompatible Script !',
                'This app contains an incompatible or more complex Script and could not be edited with this Webmanagement Console.\n\n\
                If you want to edit this script go to  Qlik Sense App Dataload Editor and edit the script manually.'
            ).onClose.subscribe(() => {
                this.router.navigate(['.'], {relativeTo: this.activeRoute.parent});
            });
        });
        */

        this.breadCrumbService.breadcrumbs
            .pipe(
                takeUntil(this.isDestroyed$)
            )
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
                    // return this.appManager.saveApp(this.app);
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

        /*
        return this.appManager.fetchApp(qDocId)
            .pipe(
                switchMap((app: IApp) => {
                    this.appManager.selectApps([app]);
                    return this.appManager.openApp(app);
                }),
                switchMap((app: ISerApp) => {
                    if (app.invalid) {
                        throw new Error('invalid app');
                    } else {
                        this.app = app;
                        this.formService.loadModel(app);
                        this.apps = this.appManager.getSelectedApps();
                        // load tasks
                        return this.taskApiService.fetchTasksForApp(app.appId);
                    }
                })
            );
            */
    }
}
