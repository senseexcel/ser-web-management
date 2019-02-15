import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject, from } from 'rxjs';
import { FormService } from '@smc/modules/form-helper';
import { AppRepository, FilterFactory, IApp } from '@smc/modules/qrs';
import { ReportModel } from '@smc/modules/ser';
import { takeUntil, map, switchMap, debounceTime, mergeMap, tap, catchError } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { IDataNode, EnigmaService } from '@smc/modules/smc-common';
import { ISerFormResponse } from '../../../../api/ser-form.response.interface';
import { AppConnector } from '../../../../providers/connection';
import { ModalService } from '@smc/modules/modal';

@Component({
    styleUrls: ['./connection.component.scss'],
    selector: 'smc-apps--edit-form-connection',
    templateUrl: 'connection.component.html'
})
export class ConnectionComponent implements OnInit, OnDestroy {

    public connectionForm: FormGroup;
    public suggestedApps: any[] = [];
    public selectedAppId: string;
    public isConnected = false;

    private model: ReportModel;
    private updateHook: Observable<any>;
    private controlInput$: Subject<string> = new Subject();
    private isDestroyed: Subject<boolean> = new Subject();
    private availableApps: EngineAPI.IDocListEntry[];

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService<ReportModel, ISerFormResponse>,
        private appRepository: AppRepository,
        private enigmaService: EnigmaService,
        private appConnector: AppConnector,
        private modalService: ModalService
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
        this.appConnector.closeConnection();

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

        this.appConnector.connect
            .pipe(takeUntil(this.isDestroyed))
            .subscribe(() => {
                this.isConnected = true;
            });

        this.appConnector.disconnect
            .pipe(takeUntil(this.isDestroyed))
            .subscribe(() => {
                this.isConnected = false;
            });
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
     * create connection to an app
     *
     * @memberof ConnectionComponent
     */
    public connectToApp() {
        this.appConnector.createConnection(this.selectedAppId)
            .pipe(catchError((error) => {
                const e = {
                    title: 'SMC_APPS.EDIT.CONNECTION.ERROR_TITLE',
                    message: {
                        key: 'SMC_APPS.EDIT.CONNECTION.ERROR_MESSAGE',
                        value: {APP: this.selectedAppId}
                    }
                };

                if (error.code === 403) {
                    e.title = 'SMC_APPS.EDIT.CONNECTION.FORBIDDEN_TITLE';
                    e.message.key = 'SMC_APPS.EDIT.CONNECTION.FORBIDDEN_MESSAGE';
                }

                this.modalService.openMessageModal(e.title, e.message);
                return of();
            }))
            .subscribe();
    }

    /**
     * close connection to an app
     *
     * @memberof ConnectionComponent
     */
    public disconnectFromApp() {
        this.appConnector.closeConnection();
    }

    /**
     * app has been selected via autocomplete list
     *
     * @param {MatAutocompleteSelectedEvent} event
     * @memberof ConnectionComponent
     */
    public onAppSelect(event: MatAutocompleteSelectedEvent) {
        const app: EngineAPI.IDocListEntry = event.option.value;
        this.selectedAppId = app.qDocId;
        this.connectionForm.controls.app.setValue(app.qDocName, { emitEvent: false });
    }

    /**
     * load apps we have access in qlik sense hub
     *
     * @private
     * @param {string} searchValue
     * @returns {Observable<EngineAPI.IDocListEntry[]>}
     * @memberof ConnectionComponent
     */
    private loadAvailableApps(searchValue: string): Observable<EngineAPI.IDocListEntry[]> {
        const filter = new RegExp(`^${searchValue}`, 'ig');
        let app$: Observable<any>;

        if (this.availableApps) {
            // load app list directly from cache
            app$ = of(this.availableApps);
        } else {
            // load app list and cache it
            app$ = from(this.enigmaService.fetchApps()).pipe(
                tap((apps) => this.availableApps = apps)
            );
        }

        app$ = app$.pipe(
            map((apps: EngineAPI.IDocListEntry[]) => {
                if (searchValue !== '') {
                    apps = apps.filter((app) => app.qDocName.match(filter));
                }
                return apps;
            })
        );
        return app$;
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
                this.selectedAppId = result.app.id;
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
            map((input) => input.replace(/(^\s*|\s*$)/g, '')),
            switchMap((input) => this.loadAvailableApps(input)),
            takeUntil(this.isDestroyed)
        ).subscribe((apps) => {
            this.suggestedApps = apps;
        });
    }
}
