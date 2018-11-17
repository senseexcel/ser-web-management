import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepickerInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Moment } from 'moment';
import { Subject, of } from 'rxjs';
import { map, switchMap, debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ILicenseUser } from '../../api/license-user.interface';
import { LicenseModel } from '../../model/license.model';
import { License, UserRepository } from '../../services';
import { MOMENT_DATE_FORMAT } from '../../api/ser-date-formats';

interface ITableUser {
    edit: boolean;

    user: ILicenseUser;
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
    public tableHeaderFields = ['id', 'from', 'to'];

    /**
     * all users fetched from license
     *
     * @type {ITableUser[]}
     * @memberof UserComponent
     */
    public users: ITableUser[];

    /**
     * values for auto suggest
     *
     * @type {any[]}
     * @memberof UserComponent
     */
    public userSuggestions: any[];

    public licensedUserInfo: any;

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

        this.licensedUserInfo = {total: 0, selected: 0, showing: 0};
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
                this.licensedUserInfo.total   = model.users.length;
                this.licensedUserInfo.showing = model.users.length;

                return model.users.map((user: ILicenseUser): ITableUser => {
                    return {
                        edit: false,
                        user
                    };
                });
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe((users: ITableUser[]) => {
            this.users = users;
            this.ready = true;
        });

        this.suggest$.pipe(
            // trigger after 300ms unless something changed
            debounceTime(300),
            // if more then 3 chars entered fetch qrs users
            switchMap((val) => val.length < 3 ? of([]) : this.repository.fetchQrsUsers(val)),
            // ensure we unsubscribe if component is destroyed
            takeUntil(this.isDestroyed$)
        ).subscribe((result) => {
            this.userSuggestions = result;
        });
    }

    /**
     * add new user
     *
     * @memberof UserComponent
     */
    public addUser() {

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        // should be an update not a copy
        this.license.addUser({id: 'NEW_USER', from: '', to: ''});
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
     * ends user edit mode
     *
     * @memberof UserComponent
     */
    public finishEditUser() {
        this.currentEditUser.edit = false;
        this.currentEditUser = null;
        this.selection.clear();
    }

    /**
     * date changed
     *
     * @param {MatDatepickerInputEvent<Moment>} event
     * @memberof UserComponent
     */
    public onDateChange(event: MatDatepickerInputEvent<Moment>, key: string) {
        this.currentEditUser.user[key] = event.value.format(MOMENT_DATE_FORMAT);
    }

    /**
     * user input changed
     *
     * @param {*} event
     * @memberof UserComponent
     */
    public onUserInputChange(value: string) {
        const insertVal = value.replace(/(^\s*|\s*$)/, '');
        this.currentEditUser.user.id = insertVal;
        // we need to force update raw data now
        // force update user
        this.suggest$.next(insertVal);
    }

    /**
     * if user is selected set to user model
     *
     * @param {MatAutocompleteSelectedEvent} selected
     * @memberof UserComponent
     */
    public onUserSelected(selected: MatAutocompleteSelectedEvent) {
        this.currentEditUser.user.id = selected.option.value;
    }
}
