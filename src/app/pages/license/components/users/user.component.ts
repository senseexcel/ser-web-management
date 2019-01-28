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

    isNew: boolean;

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

    public mode = 'list';

    /**
     * selection model
     *
     * @type {SelectionModel<ITableUser>}
     * @memberof UserComponent
     */
    public selection: SelectionModel<ITableUser>;

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

    /**
     * submit true if component will be destroyed to remove
     * all subscriptions
     *
     * @private
     * @type {Subject<boolean>}
     * @memberof UserComponent
     */
    private isDestroyed$: Subject<boolean>;

    /**
     * license service
     *
     * @private
     * @type {License}
     * @memberof UserComponent
     */
    private license: License;

    private suggest$: Subject<any>;

    private repository: UserRepository;

    constructor(
        license: License,
        repository: UserRepository
    ) {
        this.isDestroyed$ = new Subject();
        this.license      = license;
        this.selection    = new SelectionModel(false);
        this.suggest$     = new Subject();
        this.repository   = repository;

        this.licensedUserInfo = {total: 0, showing: 0};
        this.userSuggestions = [];
    }

    /**
     * component get destroyed
     *
     * @memberof UserComponent
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);

        /** null variables to ensure it is not set anymore */
        this.license      = null;
        this.selection    = null;
        this.suggest$     = null;
        this.isDestroyed$ = null;
        this.users = null;
        this.userSuggestions = null;
    }

    ngOnInit() {

        this.license.onload$.pipe(
            map((model: LicenseModel): ITableUser[] => {
                this.licensedUserInfo.total   = model.users.length;
                this.licensedUserInfo.showing = model.users.length;
                return model.users.map((user: ILicenseUser): ITableUser => {
                    return {
                        edit: false,
                        isNew: false,
                        user
                    };
                });
            }),
            takeUntil(this.isDestroyed$)
        )
        .subscribe((users: ITableUser[]) => {
            this.users = [...users];
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

        const newUser = {
            edit: true,
            isNew: true,
            user: {
                id  : '',
                from: null,
                to  : null,
                isActive: false
            }
        };

        this.currentEditUser = newUser;
        this.users = [...this.users, this.currentEditUser];
        this.mode  = 'edit';
    }

    /**
     * delete user from table
     *
     * @memberof UserComponent
     */
    public deleteUser() {

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        /** the chosen one to delete */
        const theCosenOne = this.selection.selected[0].user;

        this.license.deleteUser(theCosenOne);
        this.selection.clear();
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

        this.mode = 'edit';

        if (this.currentEditUser) {
            this.currentEditUser.edit = false;
        }

        this.currentEditUser = user;
        this.currentEditUser.edit = true;
    }

    /**
     * ends user edit mode
     *
     * @memberof UserComponent
     */
    public finishEditUser() {

        const tableUser: ITableUser = this.currentEditUser;
        tableUser.edit = false;

        this.mode = 'view';

        if (tableUser.user.id.replace(/(^\s*|\s*$)/g, '') === '' ) {
            // remove last user from table
            this.users = this.users.slice(0, -1);
            return;
        }

        if (tableUser.isNew) {
            // we need to add user to model
            this.license.addUser(this.currentEditUser.user);
            tableUser.isNew = false;
        } else {
            // nobody triggers an update ...
            this.license.update();
        }

        this.currentEditUser = null;
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
