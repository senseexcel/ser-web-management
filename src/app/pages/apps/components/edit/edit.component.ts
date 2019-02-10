import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@smc/modules/ser/provider/report.service';
import { FormService } from '@smc/modules/form-helper/provider/form.service';
import { TaskRepository } from '@smc/modules/qrs';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, tap, mergeMap } from 'rxjs/operators';
import { BreadcrumbService } from '@smc/modules/breadcrumb/provider/breadcrumb.service';
import { IBreadCrumb } from '@smc/modules/breadcrumb/api/breadcrumb.interface';
import { ModalService } from '@smc/modules/modal';
import { ReportModel } from '@smc/modules/ser';
import { EnigmaService } from '@smc/modules/smc-common';
import { ScriptService } from '@smc/modules/ser/provider';
import { CacheService } from '../../providers/cache.service';

@Component({
    selector: 'smc-qlik-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
    providers: [FormService]
})
export class AppEditComponent implements OnInit, OnDestroy {

    public properties: any[];
    public associatedItems: any;
    public selectedProperty: any;
    public isLoading = true;
    public formDataLoaded = false;
    public isSubRoute = false;
    public taskCount = 0;
    public app: string;

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
    private report: ReportModel;

    constructor(
        private formService: FormService<ReportModel, boolean>,
        private enigmaService: EnigmaService,
        private reportService: ReportService,
        private scriptService: ScriptService,
        private activeRoute: ActivatedRoute,
        private location: Location,
        private modalService: ModalService,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private taskApiService: TaskRepository,
        private cacheService: CacheService
    ) {
        this.isDestroyed$ = new Subject<boolean>();
    }

    public cancel() {
        const title = `SMC_APPS.EDIT.MODAL.CANCEL_TITLE`;
        const message = {key: `SMC_APPS.EDIT.MODAL.CANCEL_MESSAGE`};

        this.modalService.openDialog(title, message)
            .switch.subscribe((confirm) => {
                if (confirm) {
                    // should go back
                    this.router.navigate(['../..'], { relativeTo: this.activeRoute });
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
            { key: 'app'         , label: 'SMC_APPS.EDIT.PROPERTIES.ITEM.APP' },
            { key: 'template'    , label: 'SMC_APPS.EDIT.PROPERTIES.ITEM.TEMPLATE' },
            { key: 'selections'  , label: 'SMC_APPS.EDIT.PROPERTIES.ITEM.SELECTIONS' },
            { key: 'distribution', label: 'SMC_APPS.EDIT.PROPERTIES.ITEM.DISTRIBUTION' },
            { key: 'settings'    , label: 'SMC_APPS.EDIT.PROPERTIES.ITEM.SETTINGS' }
        ];

        const data = this.cacheService.currentReportData;
        this.app    = data.app;
        this.report = data.report;

        this.breadcrumbService.breadcrumbs
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

        this.taskApiService.fetchTaskCountApp(this.app)
            .subscribe(count => {
                this.formService.loadModel(this.report);
                this.associatedItems = [{
                    label: 'SMC_APPS.EDIT.ASSOCIATED_ITEMS.ITEM.TASKS',
                    items: 'tasks',
                    route: 'tasks',
                    count
                }];
                this.isLoading = false;
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
                tap((isValid) => {
                    if (!isValid) {
                        throw new Error('invalid data submitted, please check your form input');
                    }
                }),
                mergeMap(() => {
                    const cachedData   = this.cacheService.currentReportData;
                    const reportConfig = this.scriptService.createReportConfig(cachedData.raw);
                    const scriptData   = cachedData.script;

                    scriptData.script = reportConfig;
                    return this.enigmaService.writeScript(this.scriptService.stringify(scriptData), cachedData.app);
                })
            )
            .subscribe(() => {
                const title = 'SMC_APPS.EDIT.MODAL.SUCCESS_SAVE_TITLE';
                const message = {key: `SMC_APPS.EDIT.MODAL.SUCCESS_SAVE_MESSAGE`};
                this.modalService.openMessageModal(title, message);
            }, (e: Error) => {
                console.error(e.message);
            });
    }

    public navigateBack() {
        this.router.navigate(['../..'], { relativeTo: this.activeRoute });
    }

    public preview() {
        this.updateReportData().subscribe((success: boolean) => {
            if (success) {
                this.isSubRoute = true;
                this.router.navigate(['./preview'], { relativeTo: this.activeRoute });
            }
        });
    }

    public showTasks() {
        this.updateReportData().subscribe((success: boolean) => {
            this.isSubRoute = true;
            this.router.navigate(['./tasks', this.app], { relativeTo: this.activeRoute });
        });
    }

    public showForm(property) {
        let scrollToContainer: ElementRef;

        switch (property.key) {
            case 'app': scrollToContainer = this.connectionsContainer; break;
            case 'template': scrollToContainer = this.templateContainer; break;
            case 'selections': scrollToContainer = this.selectionContainer; break;
            case 'distribution': scrollToContainer = this.distributeContainer; break;
            case 'settings': scrollToContainer = this.settingsContainer; break;
            default: return;
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
    private updateReportData(): Observable<boolean> {
        return this.formService.updateModel().pipe(
            map((result) => result.every((isValid) => isValid)),
            tap(() => {
                const cleanedReport = this.reportService.cleanReport(this.report.raw);
                this.cacheService.currentReportData.raw = cleanedReport;
            })
        );
    }
}
