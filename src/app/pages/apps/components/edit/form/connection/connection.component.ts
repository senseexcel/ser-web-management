import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { FormService } from '@smc/modules/form-helper';
import { AppRepository, FilterFactory, FilterOperator, DataConverter, IApp, FilterConditionalOperator } from '@smc/modules/qrs';
import { ReportModel } from '@smc/modules/ser';
import { ITable } from '@smc/modules/qrs/api/request/table.interface';
import { takeUntil, filter, map, switchMap, debounceTime, mergeMap, tap } from 'rxjs/operators';
import { ITableData } from '@smc/modules/qrs/api/table.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { IDataNode } from '@smc/modules/smc-common';
import { ISerFormResponse } from '../../../../api/ser-form.response.interface';
import { CacheService } from '../../../../providers/cache.service';

@Component({
    selector: 'smc-apps--edit-form-connection',
    templateUrl: 'connection.component.html'
})
export class ConnectionComponent implements OnInit, OnDestroy {

    public connectionForm: FormGroup;
    public suggestedApps: any[] = [];

    private model: ReportModel;
    private updateHook: Observable<any>;
    private controlInput$: Subject<string> = new Subject();
    private isDestroyed: Subject<boolean> = new Subject();
    private selectedAppId: string;

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, ISerFormResponse>,
        private appRepository: AppRepository,
        private filterFactory: FilterFactory,
        private cacheService: CacheService
    ) {
        this.formBuilder = formBuilder;
    }

    /**
     * on component get destroyed
     *
     * @memberof ConnectionComponent
     */
    ngOnDestroy() {
        this.formService.unRegisterHook(FormService.HOOK_UPDATE, this.updateHook);
        this.isDestroyed.next(true);

        this.controlInput$.complete();
        this.isDestroyed.complete();

        this.controlInput$ = null;
        this.isDestroyed = null;
    }

    /**
     * on component will be initialized
     *
     * @memberof ConnectionComponent
     */
    ngOnInit() {
        /** create / register update hook if form should be updated */
        this.updateHook = this.buildUpdateHook();
        this.formService.registerHook(FormService.HOOK_UPDATE, this.updateHook);

        this.registerModelLoadEvent();
        this.registerAppSearchEvent();
    }

    /**
     * after view initialized start auto completion
     *
     * @memberof ConnectionComponent
     */
    public onSuggestInput() {
        this.controlInput$.next(this.connectionForm.controls.app.value);
    }

    /**
     *
     *
     * @param {MatAutocompleteSelectedEvent} event
     * @memberof ConnectionComponent
     */
    public onAppSelect(event: MatAutocompleteSelectedEvent) {
        const app: { name: string, id: string } = event.option.value;
        this.selectedAppId = app.id;
        this.connectionForm.controls.app.setValue(app.name, { emitEvent: false });
    }

    /**
     * load max 20 apps via autosuggester
     *
     * @private
     * @param {ISerApp} app
     * @returns {Observable<{app: ISerApp, apps: IApp[]}>}
     * @memberof ConnectionComponent
     */
    private loadAvailableApps(name: string): Observable<any> {

        const tableData: ITable = {
            entity: 'App',
            columns: [
                { name: 'id', columnType: 'Property', definition: 'id' },
                { name: 'name', columnType: 'Property', definition: 'name' },
            ]
        };

        const currentApp: string = this.cacheService.currentReportData.app;

        /** create filters for search query */
        const searchFor  = this.filterFactory.createFilter('name', `'${name}'`, FilterOperator.STARTS_WITH);
        const exclude    = this.filterFactory.createFilter('id', currentApp, FilterOperator.NOT_EQUAL);
        const appFilter  = this.filterFactory.createFilterGroup([searchFor, exclude], FilterConditionalOperator.AND);

        return this.appRepository.fetchTable(tableData, 0, 20, appFilter);
    }

    /**
     * build a form group for connection
     *
     * @private
     * @returns {FormGroup}
     * @memberof ConnectionComponent
     */
    private buildFormGroup(name: string = ''): FormGroup {
        const formGroup = this.formBuilder.group({
            app: this.formBuilder.control(name)
        });
        return formGroup;
    }

    /**
     * create hook for form should updated
     *
     * @private
     * @returns {Observable<string>}
     * @memberof ConnectionComponent
     */
    private buildUpdateHook(): Observable<boolean> {
        const observer = new Observable<boolean>((obs) => {
            if (this.connectionForm.invalid) {
                obs.next(false);
                return;
            }
            this.model.connections.raw = { app: this.selectedAppId };
            obs.next(true);
        });
        return observer;
    }

    /**
     * register on new model has been loaded
     *
     * @private
     * @memberof ConnectionComponent
     */
    private registerModelLoadEvent() {
        this.formService.editModel()
            .pipe(
                mergeMap((report: ReportModel) => {
                    const appName$ = report.connections.app
                        ? this.appRepository.fetchApp(report.connections.app)
                        : of({ name: '', id: '' });

                    return appName$.pipe(map((app: IApp) => {
                        return { report, app };
                    }));
                }),
                takeUntil(this.isDestroyed)
            )
            .subscribe((result: IDataNode) => {
                this.model = result.report;
                this.selectedAppId  = result.app.id;
                this.connectionForm = this.buildFormGroup(result.app.name);
            });
    }

    /**
     * register we start search for an app in appControl field
     *
     * @private
     * @memberof ConnectionComponent
     */
    private registerAppSearchEvent() {
        this.controlInput$.pipe(
            debounceTime(300),
            tap(() => this.selectedAppId = null),
            filter((result: string) => result.length > 2),
            switchMap((input) => this.loadAvailableApps(input)),
            map((response: ITableData) => DataConverter.convertQrsTableToJson(response)),
            takeUntil(this.isDestroyed)
        ).subscribe((apps) => {
            if (apps.length === 1) {
                this.selectedAppId = apps[0].id;
            }
            this.suggestedApps = apps;
        });
    }
}
