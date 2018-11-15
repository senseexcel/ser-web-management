import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepickerInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Moment } from 'moment';
import { Subject, of } from 'rxjs';
import { map, switchMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ILicenseUser } from '../../api/license-user.interface';
import { LicenseModel } from '../../model/license.model';
import { License, UserRepository } from '../../services';

interface ITableUser extends ILicenseUser {
    edit: boolean;
}

@Component({
    selector   : 'app-license-user',
    styleUrls  : ['user.component.scss'],
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnDestroy, OnInit {

    /**
     * current user which is edited
     *
     * @type {ITableUser}
     * @memberof UserComponent
     */
    public currentEditUser: ITableUser;

    public ready = false;

    /**
     * table header fields
     *
     * @memberof UserComponent
     */
    public tableHeaderFields = [
        'id',
        'from',
        'to'
    ];

    /**
     * all users fetched from license
     *
     * @type {ITableUser[]}
     * @memberof UserComponent
     */
    public users: ITableUser[];

    public userSuggestions: any[];

    private isDestroyed$: Subject<boolean>;

    /**
     * license service
     *
     * @private
     * @type {License}
     * @memberof UserComponent
     */
    private license: License;

    private selection: SelectionModel<ITableUser>;

    private suggest$: Subject<any>;

    private repository: UserRepository;

    constructor(
        license: License,
        repository: UserRepository
    ) {
        this.isDestroyed$ = new Subject();
        this.license      = license;
        this.selection    = new SelectionModel(true);
        this.suggest$     = new Subject();
        this.repository   = repository;

        this.userSuggestions = [];
    }

    /**
     * component get destroyed
     *
     * @memberof UserComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);

        /** just clear all variables to ensure it is not set anymore */
        this.license      = null;
        this.selection    = null;
        this.suggest$     = null;
        this.isDestroyed$ = null;
    }

    ngOnInit() {

        this.license.onload$.pipe(
            map((model: LicenseModel): ITableUser[] => {
                return model.users.map((user: ILicenseUser): ITableUser => {
                    return {...user, edit: false};
                });
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe((users: ITableUser[]) => {
            this.users = users;
            this.ready = true;
        });

        this.suggest$.pipe(
            debounceTime(300),
            switchMap((val) => val.length < 3 ? of([]) : this.repository.fetchQrsUsers(val)),
            takeUntil(this.isDestroyed$)
        ).subscribe((result) => {
            console.log(result);
            this.userSuggestions = result;
        });
    }

    /**
     * on click select row
     *
     * @param {ITableUser} user
     * @memberof UserComponent
     */
    public selectUser(user: ITableUser) {
        this.selection.select(user);
    }

    /**
     * on double click enable edit
     *
     * @param {ITableUser} user
     * @memberof UserComponent
     */
    public editUser(user: ITableUser) {

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        this.currentEditUser = user;
        this.currentEditUser.edit = true;
        this.selection.clear();
        this.selection.select(user);
    }

    /**
     * date inserted
     *
     * @param {MatDatepickerInputEvent<Moment>} event
     * @memberof UserComponent
     */
    public onDateInput(event: MatDatepickerInputEvent<Moment>) {
    }

    /**
     * date changed
     *
     * @param {MatDatepickerInputEvent<Moment>} event
     * @memberof UserComponent
     */
    public onDateChange(event: MatDatepickerInputEvent<Moment>) {
    }

    /**
     * user input changed
     *
     * @param {*} event
     * @memberof UserComponent
     */
    public onUserInputChange(value: string) {
        const insertVal = value.replace(/(^\s*|\s*$)/, '');
        this.suggest$.next(insertVal);
    }

    public onUserSelected(selected: MatAutocompleteSelectedEvent) {
        console.log(selected.option.value);
    }
}
