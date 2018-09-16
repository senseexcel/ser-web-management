import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '@core/modules/form-helper';
import { TaskModel } from '@core/modules/ser-task/model/task.model';
import { ExecutionModel } from '@core/modules/ser-task/model/execution.model';
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
    selector: 'app-task-form-execution',
    templateUrl: 'execution.component.html'
})

export class FormExcecutionComponent implements OnDestroy, OnInit {

    /**
     * execution form group definition
     *
     * @type {FormGroup}
     * @memberof FormExcecutionComponent
     */
    public executionForm: FormGroup;

    /**
     * true if data is loading
     *
     * @type {boolean}
     * @memberof FormExcecutionComponent
     */
    public isLoading: boolean;

    /**
     * subject to notify observers we got destroyed and need to unsubscribe now
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof FormExcecutionComponent
     */
    private isDestroyed$: Subject<boolean>;

    /**
     * form builder service to create form components
     *
     * @private
     * @type {FormBuilder}
     * @memberof FormExcecutionComponent
     */
    private formBuilder: FormBuilder;

    /**
     * form helper sevice to get current model which should edited
     * add hooks on save.
     *
     * @private
     * @type {FormService<TaskModel, any>}
     * @memberof FormExcecutionComponent
     */
    private formService: FormService<TaskModel, any>;

    /**
     * registered update hook
     *
     * @private
     * @type {Observable<any>}
     * @memberof FormExcecutionComponent
     */
    private updateHook$: Observable<any>;

    /**
     *Creates an instance of FormExcecutionComponent.
     * @param {FormBuilder} formBuilder
     * @param {FormService<TaskModel, any>} formService
     * @memberof FormExcecutionComponent
     */
    constructor(
        formBuilder: FormBuilder,
        formService: FormService<TaskModel, any>
    ) {
        this.formService = formService;
        this.formBuilder = formBuilder;
        this.isDestroyed$ = new Subject<boolean>();
    }

    /**
     * on app is initialized
     *
     * @memberof FormExcecutionComponent
     */
    ngOnInit() {

        this.isLoading = true;
        this.formService.registerHook(FormService.HOOK_UPDATE, this.buildUpdateHook());
        this.formService.editModel()
            .pipe(
                filter((model: TaskModel) => {
                    return model !== null;
                }),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((model: TaskModel) => {
                this.executionForm = this.buildExecutionForm(model.execution);
                this.isLoading     = false;
            });
    }

    /**
     * on component get destroyed
     *
     * @memberof FormExcecutionComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.formService.unRegisterHook(FormService.HOOK_UPDATE, this.updateHook$);
    }

    /**
     * build form group for execution form
     *
     * @private
     * @param {ExecutionModel} model
     * @returns {FormGroup}
     * @memberof FormExcecutionComponent
     */
    private buildExecutionForm(model: ExecutionModel): FormGroup {

        const form = this.formBuilder.group({
            enabled: this.formBuilder.control(model.enabled),
            maxRetries: this.formBuilder.control(model.maxRetries),
            taskSessionTimeout: this.formBuilder.control(model.taskSessionTimeout)
        });
        return form;
    }

    /**
     * create update hook which is called as soon form will be saved
     *
     * @private
     * @returns {Observable<any>}
     * @memberof FormExcecutionComponent
     */
    private buildUpdateHook(): Observable<any> {
        const observer = new Observable<any>((obs) => {
            const execution = this.executionForm.getRawValue();
            obs.next({
                data: {
                    fields: execution,
                    group: 'exceution'
                },
                errors: [],
                valid: this.executionForm.valid,
            });
        });
        return observer;
    }
}
