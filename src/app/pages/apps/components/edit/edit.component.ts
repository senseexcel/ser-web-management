import { Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '@smc/modules/ser/provider/report.service';
import { FormService } from '@smc/modules/form-helper/provider/form.service';
import { TaskRepository } from '@smc/modules/qrs';
import { Subject, of, Observable } from 'rxjs';
import { map, takeUntil, tap, mergeMap } from 'rxjs/operators';
import { BreadcrumbService } from '@smc/modules/breadcrumb/provider/breadcrumb.service';
import { IBreadCrumb } from '@smc/modules/breadcrumb/api/breadcrumb.interface';
import { ModalService } from '@smc/modules/modal';
import { ReportModel, ISerScriptData } from '@smc/modules/ser';
import { SmcCache, IDataNode, EnigmaService } from '@smc/modules/smc-common';
import { ScriptService } from '@smc/modules/ser/provider';

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
    private report: ReportModel;

    constructor(
        private formService: FormService<ReportModel, boolean>,
        private enigmaService: EnigmaService,
        private reportService: ReportService,
        private scriptService: ScriptService,
        private smcCache: SmcCache,
        private activeRoute: ActivatedRoute,
        private location: Location,
        private modalService: ModalService,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private taskApiService: TaskRepository
    ) {
        this.isDestroyed$ = new Subject<boolean>();
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

        this.properties = [
            { label: 'App' },
            { label: 'Template' },
            { label: 'Selections' },
            { label: 'Distribution' },
            { label: 'Settings' }
        ];

        const data: IDataNode = this.smcCache.get('smc.pages.report.edit.current.report');
        this.report = data.model;
        this.formService.loadModel(this.report);

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
                    const data: IDataNode = this.smcCache.get('smc.pages.report.edit.current');
                    const reportConfig = this.scriptService.createReportConfig(data.report.raw);
                    const scriptData: ISerScriptData = data.scriptData;
                    scriptData.script = reportConfig;
                    return this.enigmaService.writeScript(this.scriptService.stringify(scriptData), data.app);
                })
            )
            .subscribe(() => {
                const title = `Success`;
                const message = `App was successfully saved.`;
                this.modalService.openMessageModal(title, message);
            }, (e: Error) => {
                const title = `Error`;
                this.modalService.openMessageModal(title, e.message);
            });
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
            // this.router.navigate(['./tasks', this.report.appId], { relativeTo: this.activeRoute });
        });
    }

    public showForm(property) {
        let scrollToContainer: ElementRef;

        switch (property.label.toLowerCase()) {
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
                this.smcCache.set('smc.pages.report.edit.current.report.raw', cleanedReport, true);
            })
        );
    }
}
